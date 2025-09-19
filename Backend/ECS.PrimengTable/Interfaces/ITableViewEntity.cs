namespace ECS.PrimengTable.Interfaces {
    public interface ITableViewEntity<TUsername> {
        TUsername Username { get; set; }
        string TableKey { get; set; }
        string ViewAlias { get; set; }
        string ViewData { get; set; }
        public bool LastActive { get; set; }
    }
}