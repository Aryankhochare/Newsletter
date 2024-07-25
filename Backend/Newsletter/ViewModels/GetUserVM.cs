namespace Newsletter.ViewModels
{
    public class GetUserVM
    {
        public long Id { get; set; }
        
        public string Username { get; set; }
        
        public string Email { get; set; }
      
        public bool isActive { get; set; }
     
        public string Status { get; set; }

        public ICollection<string> UserRole {  get; set; }
       
        public DateTime CreatedDate { get; set; }
 
        public DateTime ModifiedDate { get; set; }
    }
}
