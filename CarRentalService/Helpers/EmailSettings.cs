﻿using System;
namespace CarRentalService.Helpers
{
	public class EmailSettings
	{
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string FromAddress { get; set; }
        public string FromName { get; set; }
    }
}

