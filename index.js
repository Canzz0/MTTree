function mttree(category, selectCategory) {
  let mainCategories = [];
  let TreeNodes = [];
  let loading = true;
  let selectedNodeId = null;

  const init = () => {
    if (category && category.length > 0) {
      const modifiedCategories = category.map((cat) => ({
        ...cat,
        masterId: cat.id === cat.masterId ? null : cat.masterId,
      }));
      mainCategories = buildTree(modifiedCategories);
      loading = false;
      render();
    } else {
      console.error("Error: Kategori Segmentasyonu çalışmıyor");
    }
  };

  const buildTree = (categories, parentMainCategory = null, depth = 0) => {
    const tree = [];
    for (const cat of categories) {
      if (
        (parentMainCategory === null && cat.masterId === null) ||
        cat.masterId === parentMainCategory
      ) {
        const catNode = { ...cat };
        const children = buildTree(categories, cat.id, depth + 1);
        if (children.length > 0) {
          catNode.children = children;
        }
        tree.push({ ...catNode, depth });
      }
    }
    return tree;
  };

  const changeCat = (nodeId) => {
    TreeNodes = TreeNodes.includes(nodeId)
      ? TreeNodes.filter((id) => id !== nodeId)
      : [...TreeNodes, nodeId];
    render();
  };

  const handleNodeClick = (node) => {
    selectedNodeId = node.id;
    changeCat(node.id);
    selectCategory([{ name: node.name, id: node.id }]);
  };

  const renderCategoryList = (nodes, depth = 0) => {
    const ul = document.createElement("ul");
    Object.assign(ul.style, styles.ul);

    nodes.forEach((node) => {
      const li = document.createElement("li");
      li.style.paddingLeft = `${depth * 12}px`;

      const div = document.createElement("div");
      const isActive = selectedNodeId === node.id;
      Object.assign(div.style, styles.categoryLink(isActive));
      div.addEventListener("click", () => handleNodeClick(node));

      const icon = document.createElement("span");
      icon.className = node.masterId === null ? "folder-icon" : "content-icon";
      Object.assign(icon.style, styles.icon);
      div.appendChild(icon);

      const text = document.createElement("span");
      text.style.flexGrow = "1";
      text.textContent = node.name;
      div.appendChild(text);

      if (node.children) {
        const toggleIcon = document.createElement("span");
        toggleIcon.className = "span-icon";
        Object.assign(toggleIcon.style, styles.toggleIcon);
        toggleIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          changeCat(node.id);
        });
        toggleIcon.innerHTML = TreeNodes.includes(node.id) ? "-" : "+";
        div.appendChild(toggleIcon);
      }

      li.appendChild(div);

      const childContainer = document.createElement("div");
      childContainer.className = "tree-content";
      Object.assign(childContainer.style, styles.childContainer);
      childContainer.style.maxHeight = TreeNodes.includes(node.id)
        ? "100px"
        : "0";

      if (node.children && TreeNodes.includes(node.id)) {
        childContainer.appendChild(
          renderCategoryList(node.children, depth + 1)
        );
      }

      li.appendChild(childContainer);
      ul.appendChild(li);
    });

    return ul;
  };

  const render = () => {
    const app = document.getElementById("app");
    app.innerHTML = "";
    if (loading) {
      app.innerHTML = "<p>Loading categories...</p>";
    } else {
      app.appendChild(renderCategoryList(mainCategories, 0));
    }
  };

  init();
}
const styles = {
  ul: {
    listStyle: "none",
    fontFamily: "Arial, sans-serif",
    padding: "0",
    margin: "0",
  },
  li: {
    paddingLeft: "12px",
  },
  categoryLink: (isActive) => ({
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "5px",
    color: isActive ? "rgb(73, 73, 73)" : "",
    backgroundColor: isActive ? "rgb(233, 233, 233)" : "",
  }),
  icon: {
    marginRight: "8px",
  },
  toggleIcon: {
    cursor: "pointer",
  },
  childContainer: {
    overflow: "hidden",
    transition: "max-height 0.4s ease",
  },
};

module.exports = mttree;
