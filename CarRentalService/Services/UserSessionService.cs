using System;
using CarRentalService.Models;

namespace CarRentalService.Services
{
	public class UserSessionService : IUserSessionService
    {
        private readonly Dictionary<Guid, UserSession> _userSessions = new Dictionary<Guid, UserSession>();

        public void SetUserSession(UserSession session)
        {
            _userSessions[session.UserId] = session;
        }

        public UserSession GetUserSession(Guid userId)
        {
            _userSessions.TryGetValue(userId, out var session);
            return session;
        }

        public void ClearUserSession(Guid userId)
        {
            _userSessions.Remove(userId);
        }
    }
}

