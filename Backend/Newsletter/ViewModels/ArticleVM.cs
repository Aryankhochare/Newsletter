namespace Newsletter.ViewModels
{
    public class ArticleVM
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Title { get; set; }
        public string EditorContent { get; set; }
        public DateTime PostedOn { get; set; }
        public DateTime ModifiedDate { get; set; }
        public bool IsVerified { get; set; }
        public string CoverImage { get; set; }
        public bool IsRejected { get; set; }
    }

}
