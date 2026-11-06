namespace ECSPrimengTableExample.DTOs;

public static class TreeDemoData {
    public static IQueryable<TreeDemoDto> Create() {
        var rows = new List<TreeDemoDto>();
        int nextId = 1;
        TreeDemoDto Add(int parentId, string text) {
            int id = nextId++;
            var row = new TreeDemoDto {
                RowID = id, Id = id, ParentId = parentId, Text = text,
                Started = new DateTime(2025, 1, 1, 8, 30, 0, DateTimeKind.Utc).AddDays(id % 180),
                Active = id % 3 != 0, Budget = 125.75m * (id % 19 + 1),
                Progress = id % 11 == 0 ? null : id % 101,
                Tip = $"Task {id}: deterministic progress"
            };
            rows.Add(row);
            return row;
        }
        for (int rootIndex = 1; rootIndex <= 36; rootIndex++) {
            var root = Add(0, $"Project {rootIndex:D2}");
            int children = rootIndex == 1 ? 32 : 3;
            for (int childIndex = 1; childIndex <= children; childIndex++) {
                var child = Add(root.Id, $"Project {rootIndex:D2} / Task {childIndex:D2}");
                if (childIndex != 1) continue;
                int parent = child.Id;
                for (int level = 3; level <= 6; level++)
                    parent = Add(parent, $"Project {rootIndex:D2} / Level {level}").Id;
            }
        }
        var parentKeys = rows.Select(row => row.ParentId).ToHashSet();
        foreach (var row in rows) row.HasChildren = parentKeys.Contains(row.Id);
        return rows.AsQueryable();
    }
}