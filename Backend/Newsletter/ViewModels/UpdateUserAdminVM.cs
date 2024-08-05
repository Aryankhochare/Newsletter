namespace Newsletter.ViewModels
{
    public class UpdateUserAdminVM
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public ICollection<long> UserRoles { get; set; }
    }
}
