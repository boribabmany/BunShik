import cartIcon from "../../images/carticon.png";

function CartBar({ count, total, onCheckClick, disabled }) {
  const handleBoxClick = () => {
    if (disabled) return; // 장바구니가 비어있으면 박스 클릭도 무시
    onCheckClick();
  };

  return (
    <div className="menu-cartbar-footer">
      <div
        className="menu-cartbar-box"
        onClick={handleBoxClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        <img src={cartIcon} alt="" className="menu-cartbar-icon" />
        <p className="menu-cartbar-label">장바구니</p>
        <p className="menu-cartbar-count">{count}개</p>
        <p className="menu-cartbar-total">{total.toLocaleString()}원</p>
      </div>

      <button
        type="button"
        onClick={onCheckClick}
        disabled={disabled}
        className="menu-cartbar-confirm"
      >
        주문 확인
      </button>
    </div>
  );
}

export default CartBar;
