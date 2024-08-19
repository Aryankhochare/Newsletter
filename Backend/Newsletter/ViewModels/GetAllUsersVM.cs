using Newsletter.Models;
using Supabase.Postgrest.Attributes;

namespace Newsletter.ViewModels
{
    public class GetAllUsersVM
    {
   
        public string Id { get; set; }
     
        public string Username { get; set; }
  
        public string Email { get; set; }

        public bool isActive { get; set; }
     
        public string Status { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }

        public List<UserUserRoles> UserUserRoles { get; set; }

    }
}
