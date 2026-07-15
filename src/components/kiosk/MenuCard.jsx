function MenuCard({ menu, onClick }) {
  const isSoldOut = !menu.is_available;

  return (
    <div>
      <div>
        <img src={menu.image_url} alt={menu.menu_name} />

        {/* 품절이면 이미지 위에 반투명 오버레이 + "품절" 텍스트 표시 */}
        {isSoldOut && (
          <div>
            <span>품절</span>
          </div>
        )}
      </div>

      <p>{menu.menu_name}</p>
      <p>{menu.price.toLocaleString()}원</p>

      {/* 품절이면 + 버튼 비활성화 */}
      <button type="button" onClick={onClick} disabled={isSoldOut}>
        +
      </button>
    </div>
  );
}

export default MenuCard;
