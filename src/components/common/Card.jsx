function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-lg border border-gray-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeaders({ children, className = "", ...props }) {
  return (
    <div className={`p-6 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`p-6 pt-0 flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeaders, CardContent, CardFooter };
