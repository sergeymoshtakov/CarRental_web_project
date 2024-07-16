using System;
using CarRentalService.Models;

namespace CarRentalService.Services
{
	public interface IUserSessionService
	{
        void SetUserSession(UserSession session);
        UserSession GetUserSession(Guid userId);
        void ClearUserSession(Guid userId);
    }
}

