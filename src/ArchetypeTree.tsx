import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

// Main component for the tree view
export default function ArchitypeTree({ data }) {
  return (
    <div className="ml-4 min-h-screen">
      <TreeNode node={data} />
    </div>
  );
}

// Recursive TreeNode component
const TreeNode = ({ node, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if the node has children
  const hasChildren = node.children && node.children.length > 0;

  // Handle node click to expand/collapse
  const handleNodeClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  // Render the node
  return (
    <div className="ml-4 w-fit">
      <div
        className={`
          flex items-center cursor-pointer 
          hover:bg-gray-200 
          p-2 rounded 
          ${hasChildren ? "hover:bg-blue-100" : ""}
        `}
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={handleNodeClick}
      >
        {/* Show chevron only if has children */}
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )
        ) : (
          <div className="w-4 h-4 inline-block" />
        )}

        <span className={`ml-2 ${hasChildren ? "font-semibold" : ""}`}>
          {node.name}
        </span>
      </div>

      {/* Recursively render children when expanded */}
      {hasChildren && isExpanded && (
        <div className="border-l-2 border-gray-300">
          {node.children.map((childNode, index) => (
            <TreeNode
              key={`${childNode.name}-${index}`}
              node={childNode}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Sample data (you can replace this with your actual JSON)
