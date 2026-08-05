import SetComponentsField from "./SetComponentsField";

const MENU_CATEGORIES = [
  "세트", "떡볶이", "떡볶이맛", "라면", "김밥", "순대구성", "사이드", "음료",
];

export default function MenuEditorForm({
  item, menus, isComponentsLoading, selectedComponentIds, componentSettings, onChange,
  onImageChange, onComponentToggle, onComponentSettingChange,
}) {
  const isComponent = item?.menu_type === "COMPONENT";
  const regularMenus = menus.filter(
    (menu) => menu.category?.trim() !== "세트",
  );

  return (
    <>
      <div className="form-group">
        <label>메뉴명</label>
        <input name="menu_name" value={item?.menu_name || ""} onChange={onChange}/>
      </div>

      <div className="form-group">
        <label>영문명</label>
        <input name="menu_name_en" value={item?.menu_name_en || ""} onChange={onChange}/>
      </div>
      <div className="form-group">
        <label>메뉴 용도</label>
        <select name="menu_type" value={item?.menu_type || "NORMAL"} onChange={onChange} disabled={item?.category?.trim() === "세트"}>
          <option value="NORMAL">일반 판매 메뉴</option>
          <option value="COMPONENT">세트 구성 전용</option>
        </select>
      </div>

      <div className="form-group">
        <label>카테고리</label>
        <select name="category" value={item?.category || ""} onChange={onChange} >
          <option value="">카테고리 선택</option>
          {MENU_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {!isComponent && (
        <>
          <div className="form-group">
            <label>설명</label>
            <input name="description" value={item?.description || ""} onChange={onChange} />
          </div>

          <div className="form-group">
            <label>영문 설명</label>
            <input name="description_en" value={item?.description_en || ""} onChange={onChange} />
          </div>
        </>
      )}

      {item?.category?.trim() === "세트" && (
        <SetComponentsField
          menus={regularMenus}
          isLoading={isComponentsLoading}
          selectedIds={selectedComponentIds}
          settings={componentSettings}
          onToggle={onComponentToggle}
          onSettingChange={onComponentSettingChange}
        />
      )}

      {!isComponent && (
        <>
          <div className="form-group">
            <label>가격</label>
            <input type="number" step="100" min="0" name="price" value={item?.price ?? ""} onChange={onChange}/>
          </div>

          <div className="form-group">
            <label>사진</label>
            <label className="image-upload">
              <span>사진 선택 (버튼클릭)</span>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                hidden
              />
            </label>
          </div>
        </>
      )}

      <div className="form-group">
        <label>상태</label>
        <select
          name="base_is_available"
          value={item?.base_is_available ?? item?.is_available}
          onChange={onChange}
        >
          <option value={true}>판매중</option>
          <option value={false}>품절</option>
        </select>
      </div>
    </>
  );
}
