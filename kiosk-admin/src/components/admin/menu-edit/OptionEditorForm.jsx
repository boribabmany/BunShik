export default function OptionEditorForm({ item, onChange, onImageChange }) {
  return (
    <>
      <div className="form-group">
        <label>옵션명</label>
        <input
          name="option_name"
          value={item?.option_name || ""}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>영문명</label>
        <input
          name="option_name_en"
          value={item?.option_name_en || ""}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label>추가 가격</label>
        <input
          type="number"
          step="100"
          min="0"
          name="option_price"
          value={item?.option_price ?? ""}
          onChange={onChange}
        />
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

      <div className="form-group">
        <label>상태</label>
        <select
          name="option_is_available"
          value={item?.option_is_available}
          onChange={onChange}
        >
          <option value={true}>판매중</option>
          <option value={false}>품절</option>
        </select>
      </div>
    </>
  );
}
