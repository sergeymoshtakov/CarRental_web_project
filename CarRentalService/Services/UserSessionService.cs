using System;
using System.Collections.Generic;
using CarRentalService.Models;

namespace CarRentalService.Services
{
    public class UserSessionService : IUserSessionService
    {
        private readonly Dictionary<Guid, UserSession> _sessions = new Dictionary<Guid, UserSession>();

        public void SetUserSession(UserSession session)
        {
            _sessions[session.UserId] = session;
        }

        public UserSession GetUserSession(Guid userId)
        {
            _sessions.TryGetValue(userId, out var session);
            return session;
        }

        public void ClearUserSession(Guid userId)
        {
            _sessions.Remove(userId);
        }
    }
}
