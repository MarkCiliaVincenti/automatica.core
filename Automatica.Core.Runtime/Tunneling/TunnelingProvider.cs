﻿using System;
using System.Threading;
using System.Threading.Tasks;

namespace Automatica.Core.Runtime.Tunneling
{
    internal class TunnelingProvider : ITunnelingProvider
    {
        private readonly ITunnelingService _tunnelingService;

        public TunnelingProvider(ITunnelingService tunnelingService)
        {
            _tunnelingService = tunnelingService;
        }

        public async Task<bool> CreateTunnelAsync(TunnelingProtocol protocol, string address, string targetDomain, CancellationToken token)
        {
            var uriPrefix = "http://";
            if (protocol == TunnelingProtocol.Tcp)
            {
                uriPrefix = "tcp://";
            }
            var uri = new Uri($"{uriPrefix}{address}");

            return await _tunnelingService.CreateTunnelAsync(uri, targetDomain, token);
        }

        public Task<bool> IsAvailableAsync(CancellationToken token)
        {
            return _tunnelingService.IsRunning(token);
        }
    }
}
