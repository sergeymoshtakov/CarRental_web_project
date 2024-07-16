using System;
namespace CarRentalService.Models
{
	public class UserSession
	{
        public Guid UserId { get; set; }
        public bool IsAuthenticated { get; set; }
    }
}

