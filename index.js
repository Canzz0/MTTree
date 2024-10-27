import React, { useState, useEffect } from 'react';

const MtTree = ({ category, selectCategory }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [treeNodes, setTreeNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    init();
  }, [category]);

  const init = () => {
    if (category && category.length > 0) {
      const modifiedCategories = category.map((cat) => ({
        ...cat,
        masterId: cat.id === cat.masterId ? null : cat.masterId,
      }));
      const tree = buildTree(modifiedCategories);
      setMainCategories(tree);
      setLoading(false);
    } else {
      console.error("Error: Kategori Segmentasyonu çalışmıyor");
    }
  };

  const buildTree = (categories, parentMainCategory = null) => {
    const tree = [];
    for (const cat of categories) {
      if (
        (parentMainCategory === null && cat.masterId === null) ||
        cat.masterId === parentMainCategory
      ) {
        const children = buildTree(categories, cat.id);
        tree.push({
          ...cat,
          children: children.length > 0 ? children : undefined,
        });
      }
    }
    return tree;
  };

  const changeCat = (nodeId) => {
    setTreeNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const handleNodeClick = (node) => {
    setSelectedNodeId(node.id);
    changeCat(node.id);
    selectCategory([{ name: node.name, id: node.id }]);
  };

  const renderCategoryList = (nodes, depth = 0) => {
    return React.createElement(
      'ul',
      { style: styles.ul },
      nodes.map((node) =>
        React.createElement(
          'li',
          { key: node.id, style: { paddingLeft: `${depth * 12}px` } },
          React.createElement(
            'div',
            {
              style: styles.categoryLink(selectedNodeId === node.id),
              onClick: () => handleNodeClick(node),
            },
            React.createElement('span', { className: node.masterId === null ? "folder-icon" : "content-icon", style: styles.icon }),
            React.createElement('span', { style: { flexGrow: '1' } }, node.name),
            node.children && React.createElement(
              'span',
              {
                className: "span-icon",
                style: styles.toggleIcon,
                onClick: (e) => {
                  e.stopPropagation();
                  changeCat(node.id);
                }
              },
              treeNodes.includes(node.id) ? '-' : '+'
            ),
          ),
          node.children && React.createElement(
            'div',
            { className: "tree-content", style: { ...styles.childContainer, maxHeight: treeNodes.includes(node.id) ? "100px" : "0" } },
            renderCategoryList(node.children, depth + 1)
          )
        )
      )
    );
  };

  const render = () => {
    if (loading) {
      return React.createElement('p', null, 'Loading categories...');
    }
    return renderCategoryList(mainCategories);
  };

  return React.createElement('div', { id: "app" }, render());
};

const styles = {
  ul: {
    listStyle: "none",
    fontFamily: "Arial, sans-serif",
    padding: "0",
    margin: "0",
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

export default MtTree;
