﻿using System;
using System.Threading.Tasks;
using Automatica.Core.Base.License;
using Automatica.Core.EF.Models;
using Microsoft.Extensions.Logging;

namespace Automatica.Core.Driver.Loader
{
    public class DriverFactoryLoader : IDriverFactoryLoader 
    {
        private readonly ILogger _logger;
        private readonly IDriverNodesStore _driverNodeStore;
        private readonly IDriverStore _driverStore;
        private readonly ILicenseContract _licenseContract;

        public DriverFactoryLoader(ILogger logger, IDriverNodesStore driverNodeStore, IDriverStore driverStore, ILicenseContract licenseContract)
        {
            _logger = logger;
            _driverNodeStore = driverNodeStore;
            _driverStore = driverStore;
            _licenseContract = licenseContract;
        }
        public Task<IDriver> LoadDriverFactory(NodeInstance nodeInstance, IDriverFactory factory, IDriverContext context)
        {
            var driver = factory.CreateDriver(context);

            nodeInstance.State = NodeInstanceState.Loaded;
            try
            {
                if (driver.BeforeInit())
                {
                    _driverStore.Add(driver.Id, driver);
                    nodeInstance.State = NodeInstanceState.Initialized;
                    driver.Configure();
                }
                else
                {
                    nodeInstance.State = NodeInstanceState.UnknownError;
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Error initialize driver {factory.DriverName} {e}");
                nodeInstance.State = NodeInstanceState.UnknownError;
            }

            _driverNodeStore.AddChild(driver, driver);
            for(int i = 0; i <= driver.ChildrensCreated; ++i)
            {
                _licenseContract.IncrementDriverCount();
            }


            AddDriverRecursive(driver, driver);
            return Task.FromResult(driver);
        }

        private void AddDriverRecursive(IDriver root, IDriverNode driver)
        {
            if (driver.Children == null)
            {
                return;
            }
            foreach (var dr in driver.Children)
            {
                _driverNodeStore.AddChild(root, dr);

                _licenseContract.IncrementDriverCount();

                if (_licenseContract.DriverLicenseCountExceeded())
                {
                    _logger.LogError("Cannot instantiate more data-points, license exceeded");
                    return;
                }

                AddDriverRecursive(root, dr);
            }
        }
    }
}
