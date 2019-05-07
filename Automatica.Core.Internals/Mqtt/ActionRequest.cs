﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Automatica.Core.Internals.Mqtt
{
    public enum SlaveAction
    {
        Start,
        Stop,
        Restart,
        Kill
    }

    public class ActionRequest
    {
        public SlaveAction Action { get; set; }
        public string ImageName { get; set; }
        public string Tag { get; set; }
        public string ImageSource { get; set; }
    }
}
