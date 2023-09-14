using Backend.Infrastracture;
using Backend.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repo
{
    public class UsersRepo
    {
        private ProjectDbContext projectDbContext;
        public UsersRepo(ProjectDbContext context)
        {
            projectDbContext = context;
        }
        public User FindUserByUsername(string username)
        {
            return projectDbContext.Users.FirstOrDefault(x => x.Username == username);
        }
        public User UpdateUser(User u)
        {
            User retval = projectDbContext.Users.Update(u).Entity;
            projectDbContext.SaveChanges();
            return retval;
        }
        public List<User> GetSellers()
        {
            return projectDbContext.Users.ToList();
        }
        public User FindByEmail(string email)
        {
            return  projectDbContext.Users.FirstOrDefault(x => x.Email == email);

        }
        public User AddUser(User u)
        {
            User retval =  projectDbContext.Users.Add(u).Entity;
            projectDbContext.SaveChanges();
            return retval;
        }
        public User Find(long id)
        {
            return projectDbContext.Users.Find(id);
        }
    }
}
