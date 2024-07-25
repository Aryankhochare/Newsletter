namespace Newsletter.ViewModels
{
    public class CreateUserVM
    {
        public string Username { get; set; }
        
        public string Password { get; set; }
       
        public string Email { get; set; }

        public ICollection<int> UserRoles { get; set; }
       
    }
}
