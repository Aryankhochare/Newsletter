namespace Newsletter.ViewModels
{
    public class CreateNewsArticleVM
    {
        public string CategoryName { get; set; }
        public string Title { get; set; }
        public string EditorContent { get; set; }

        public IFormFile CoverImage { get; set; }

        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public List<string> ImageNames { get; set; } = new List<string>();
    }
}
