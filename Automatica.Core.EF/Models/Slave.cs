﻿using Automatica.Core.Model;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Automatica.Core.EF.Models
{
    public class Slave : TypedObject
    {
        public Guid ObjId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public string ClientId { get; set; }
        public string ClientKey { get; set; }

        [NotMapped]
        public bool Connected { get; set; }
    }
}
