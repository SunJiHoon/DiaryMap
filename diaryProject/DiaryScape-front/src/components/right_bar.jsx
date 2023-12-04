const RightBar = ({ children, rightBarOpen }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        right: rightBarOpen ? '0px' : '-260px',
        zIndex: '2',
        display: 'flex',
        alignItems: 'flex-start',
        marginRight: '1.6em',
        transition: 'right 0.3s',
      }}
    >
      {children}
    </div>
  );
};

export default RightBar;
