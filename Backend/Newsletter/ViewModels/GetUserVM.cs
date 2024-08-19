namespace Newsletter.ViewModels
{
    public class GetUserVM
    {
        public string Id { get; set; }
        
        public string Username { get; set; }
        
        public string Email { get; set; }
      
        public bool isActive { get; set; }
     
        public string Status { get; set; }

        public ICollection<string> UserRole {  get; set; }

        public ICollection<string> Category { get; set; }
       
        public DateTime CreatedDate { get; set; }
 
        public DateTime ModifiedDate { get; set; }
    }
}
