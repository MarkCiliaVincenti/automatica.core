﻿namespace Automatica.Core.Base.License
{
    public interface ILicenseContract
    {
        bool IsFeatureLicensed(string featureName);
    }
}
