import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { validateMenu, validateOption } from "../../utils/validation";
import useMenuStore from "../../store/menuStore";
import useOptionStore from "../../store/optionStore";
import ImagePreviewModal from "../../components/admin/ImagePreviewModal";
import "../../styles/AdminMenuEdit.css";
import bunshikLogo from "../../images/bunshiklogo.png";

const createMenuFormData = (menu, imageFile) => {
  const formData = new FormData();

  formData.append("menuName", menu.menu_name);
  formData.append("menuNameEn", menu.menu_name_en);
  formData.append("price", menu.price);
  formData.append("category", menu.category);
  formData.append("description", menu.description || "");
  formData.append("descriptionEn", menu.description_en || "");
  formData.append("isAvailable", menu.is_available);

  if (imageFile) {
    formData.append("file", imageFile);
  }
  return formData;
};

export default function AdminMenuEdit() {
  const navigate = useNavigate();
  const { menuList, loadMenus, addMenu, editMenu, stopMenu, resumeMenu } = useMenuStore();
  const { optionList, loadOptions, addOption, editOption, stopOption, resumeOption, } = useOptionStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState("menu");
  const [isAddMode, setIsAddMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const location = useLocation();
  const [menuPage, setMenuPage] = useState(1);
  const [optionPage, setOptionPage] = useState(1);
  const MENU_PER_PAGE = 5;
  const OPTION_PER_PAGE = 3;
  //페이지가 처음 열릴 때 메뉴와 옵션 데이터를 불러오는 역할
  useEffect(() => {
    const fetchData = async () => {
      await loadMenus();
      await loadOptions();
    };
    fetchData();
  }, [loadMenus, loadOptions]);
  useEffect(() => {
    if (!location.state) return;

    setImageFile(null);
    setImagePreviewUrl(null);

    // 등록 모드
    if (location.state.isAddMode) {
      setEditMode(location.state.type);
      setIsAddMode(true);

      if (location.state.type === "menu") {
        setSelectedItem({ menu_name: "", menu_name_en: "",  category: "", price: 0, is_available: true, image_url: "", description: "", description_en: "",
        });
      } else {
        setSelectedItem({ option_name: "", option_name_en: "", option_price: 0, option_is_available: true, option_image: "",
        });
      }
      return;
    }
    // 수정 모드
    if (location.state.item) {
      setEditMode(location.state.type);
      setSelectedItem(location.state.item);
      setIsAddMode(false);
    }
  }, [location.state]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);
  //--메뉴리스트-------------------------------------------------
  //메뉴삭제
  // 메뉴 판매중단 / 판매재개
  const handleToggleMenu = async (menu) => {
    const message = menu.is_visible
      ? "메뉴 판매를 중단하시겠습니까?"
      : "메뉴 판매를 재개하시겠습니까?";

    if (!window.confirm(message)) return;

    if (menu.is_visible) {
      await stopMenu(menu.menu_id);
    } else {
      await resumeMenu(menu.menu_id);
    }

    if (selectedItem?.menu_id === menu.menu_id) {
      setSelectedItem(null);
      setIsAddMode(false);
    }
  };
  //메뉴수정
  const handleSave = async () => {
    const error = validateMenu(selectedItem, imageFile);

    if (error) {
      alert(error);
      return;
    }
    try {
      const formData = createMenuFormData(selectedItem, imageFile);
      await editMenu(selectedItem.menu_id, formData);
      alert("수정되었습니다.");
      setSelectedItem(null);
      setImageFile(null);
      setImagePreviewUrl(null);
      setIsAddMode(false);
    } catch (error) {
      console.error("메뉴 수정 실패:", error);
      alert("수정 실패");
    }
  };
  //메뉴등록
  const handleAddMenu = async () => {
    const error = validateMenu(selectedItem, imageFile);
    if (error) {
      alert(error);
      return;
    }
    try {
      const formData = createMenuFormData(selectedItem, imageFile);

      await addMenu(formData);
      alert("등록되었습니다.");
      setSelectedItem(null);
      setImageFile(null);
      setImagePreviewUrl(null);
      setIsAddMode(false);
    } catch (error) {
      console.error("메뉴 등록 실패:", error);
      alert("등록 실패");
    }
  };
  //----------------------------------------------------------------------------
  //오른쪽 구역
  //수정 버튼을 눌렀을 때 어떤 항목을 수정할지 상태를 바꾸는 역할
  const handleEditClick = (type, item) => {
    setEditMode(type);
    setSelectedItem(item);
    setImageFile(null);
    setImagePreviewUrl(null);
    setIsAddMode(false);
  };
  // 메뉴와 옵션 이름 수정
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "option_price"
          ? value === ""
            ? ""
            : Number(value)
          : name === "is_available" || name === "option_is_available"
            ? value === "true"
            : value,
    }));
  };
  //이미지 등록하는 거
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviewUrl(previewUrl);
  };
  //옴션------------------------------------------------------------
  // 옵션 등록
  const handleAddOption = async () => {
    const error = validateOption(selectedItem, imageFile);
    if (error) {
      alert(error);
      return;
    }
    try {
      await addOption(selectedItem, imageFile);
      alert("옵션추가되었습니다.");

      setSelectedItem(null);
      setImageFile(null);
      setImagePreviewUrl(null);
      setIsAddMode(false);
    } catch {
      alert("옵션추가 실패");
    }
  };

  //옵션삭제
  const handleToggleOption = async (option) => {
    const message = option.is_visible
      ? "판매를 중단하시겠습니까?"
      : "판매를 재개하시겠습니까?";

    if (!window.confirm(message)) return;

    if (option.is_visible) {
      await stopOption(option.option_id);
    } else {
      await resumeOption(option.option_id);
    }

    if (selectedItem?.option_id === option.option_id) {
      setSelectedItem(null);
      setImageFile(null);
      setImagePreviewUrl(null);
      setIsAddMode(false);
    }
  };

  //옵션 수정
  const handleSaveOption = async () => {
    const error = validateOption(selectedItem, imageFile);
    if (error) {
      alert(error);
      return;
    }
    try {
      await editOption(selectedItem, imageFile);
      alert("옵션수정되었습니다.");

      setSelectedItem(null);
      setIsAddMode(false);
    } catch {
      alert("옵션수정 실패");
    }
  };
  //---------------------------------------------------------------------
  //메뉴페이지
  const menuStart = (menuPage - 1) * MENU_PER_PAGE;
  const currentMenus = menuList.slice(menuStart, menuStart + MENU_PER_PAGE);
  const menuTotalPage = Math.ceil(menuList.length / MENU_PER_PAGE);
  //옵션페이지
  const optionStart = (optionPage - 1) * OPTION_PER_PAGE;
  const currentOptions = optionList.slice(
    optionStart,
    optionStart + OPTION_PER_PAGE,
  );
  const optionTotalPage = Math.ceil(optionList.length / OPTION_PER_PAGE);
  const selectedImageUrl =
    editMode === "menu"
      ? imagePreviewUrl || selectedItem?.image_url || bunshikLogo
      : imagePreviewUrl || selectedItem?.option_image || bunshikLogo;
  const selectedImageAlt =
    editMode === "menu"
      ? selectedItem?.menu_name || "기본 이미지"
      : selectedItem?.option_name || "기본 이미지";
  const handleImageClick = (imageUrl, alt) => {
    if (!imageUrl) return;
    setEnlargedImage({ imageUrl, alt });
  };
  // -----------------------------------------------------------------------
  return (
    <div className="admin-edit-page">
      {/* 왼쪽 영역*/}
      <div className="edit-left">
        <div className="edit-header">
          <img src={bunshikLogo} alt="분식 로고" className="edit-logo" />
          <h2 className="edit-title">관리자 메뉴 수정 및 등록</h2>
        </div>
        <div className="register-button-area">
          <button
            className="register-btn"
            onClick={() => {
              setEditMode("menu");
              setIsAddMode(true);
              setImageFile(null);
              setImagePreviewUrl(null);
              setSelectedItem({
                menu_name: "",
                menu_name_en: "",
                category: "",
                price: 0,
                is_available: true,
                image_url: "",
                description: "",
                description_en: "",
              });
            }}
          >
            {" "}
            + 메뉴 등록{" "}
          </button>
        </div>

        {/* 메뉴 테이블 */}
        <div className="edit-table-box">
          <table className="edit-table">
            <thead>
              <tr>
                <th>사진</th>
                <th>메뉴명</th>
                <th>영문명</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {currentMenus.map((menu) => (
                <tr
                  key={menu.menu_id}
                  className={!menu.is_visible ? "stopped-row" : ""}
                >
                  <td>
                    {menu.image_url ? (
                      <button
                        type="button"
                        className="image-preview-trigger"
                        aria-label={`${menu.menu_name} 사진 확대`}
                        onClick={() =>
                          handleImageClick(menu.image_url, menu.menu_name)
                        }
                      >
                        <img src={menu.image_url} alt={menu.menu_name} />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{menu.menu_name}</td>
                  <td>{menu.menu_name_en || "-"}</td>
                  <td>{menu.category}</td>
                  <td>{menu.price.toLocaleString()}원</td>
                  <td>
                    <span
                      className={`status-badge ${
                        !menu.is_visible
                          ? "status-stopped"
                          : menu.is_available
                            ? "status-active"
                            : "status-soldout"
                      }`}
                    >
                      {!menu.is_visible
                        ? "판매중단"
                        : menu.is_available
                          ? "판매중"
                          : "품절"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEditClick("menu", menu)}>
                      수정
                    </button>
                    <button
                      className={`visibility-toggle-btn ${
                        menu.is_visible ? "stop-btn" : "resume-btn"
                      }`}
                      onClick={() => handleToggleMenu(menu)}
                    >
                      {menu.is_visible ? "판매중단" : "판매재개"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({ length: menuTotalPage }, (_, i) => (
              <button
                key={i}
                className={menuPage === i + 1 ? "active" : ""}
                onClick={() => setMenuPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 옵션 등록 버튼 */}
        <div className="register-button-area">
          <button
            className="register-btn"
            onClick={() => {
              setEditMode("option");
              setIsAddMode(true);
              setImageFile(null);
              setImagePreviewUrl(null);
              setSelectedItem({
                option_name: "",
                option_name_en: "",
                option_price: 0,
                option_is_available: true,
                option_image: "",
              });
            }}
          >
            {" "}
            + 옵션 등록
          </button>
        </div>
        {/* 옵션 테이블 */}
        <div className="edit-table-box">
          <table className="edit-table">
            <thead>
              <tr>
                <th>사진</th>
                <th>옵션명</th>
                <th>영문명</th>
                <th>추가 가격</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {currentOptions.map((option) => (
                <tr
                  key={option.option_id}
                  className={!option.is_visible ? "stopped-row" : ""}
                >
                  <td>
                    {option.option_image ? (
                      <button
                        type="button"
                        className="image-preview-trigger"
                        aria-label={`${option.option_name} 사진 확대`}
                        onClick={() =>
                          handleImageClick(
                            option.option_image,
                            option.option_name,
                          )
                        }
                      >
                        <img
                          src={option.option_image}
                          alt={option.option_name}
                        />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{option.option_name}</td>
                  <td>{option.option_name_en || "-"}</td>
                  <td>+{option.option_price.toLocaleString()}원</td>
                  <td>
                    <span
                      className={`status-badge ${
                        !option.is_visible
                          ? "status-stopped"
                          : option.option_is_available
                            ? "status-active"
                            : "status-soldout"
                      }`}
                    >
                      {!option.is_visible
                        ? "판매중단"
                        : option.option_is_available
                          ? "판매중"
                          : "품절"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEditClick("option", option)}>
                      수정
                    </button>
                    <button
                      className={`visibility-toggle-btn ${
                        option.is_visible ? "stop-btn" : "resume-btn"
                      }`}
                      onClick={() => handleToggleOption(option)}
                    >
                      {option.is_visible ? "판매중단" : "판매재개"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          {Array.from({ length: optionTotalPage }, (_, i) => (
            <button
              key={i}
              className={optionPage === i + 1 ? "active" : ""}
              onClick={() => setOptionPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {/*오른쪽 수정 패널*/}
      <div className="edit-right">
        <div className="edit-content">
          <div className="preview-box">
            <button
              type="button"
              className="image-preview-trigger"
              aria-label={`${selectedImageAlt} 사진 확대`}
              onClick={() =>
                handleImageClick(selectedImageUrl, selectedImageAlt)
              }
            >
              <img src={selectedImageUrl} alt={selectedImageAlt} />
            </button>

            <div className="preview-title">
              <span className="preview-label">
                {editMode === "menu" ? "메뉴 등록하기" : "옵션 등록하기"}
              </span>

              <h3 className="preview-name">
                {editMode === "menu"
                  ? selectedItem?.menu_name
                  : selectedItem?.option_name}
              </h3>
              <p className="preview-name-en">
                {editMode === "menu"
                  ? selectedItem?.menu_name_en
                  : selectedItem?.option_name_en}
              </p>
            </div>
          </div>

          <div className="form-group">
            <label>{editMode === "menu" ? "메뉴명" : "옵션명"}</label>
            <input
              name={editMode === "menu" ? "menu_name" : "option_name"}
              value={
                editMode === "menu"
                  ? selectedItem?.menu_name || ""
                  : selectedItem?.option_name || ""
              }
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>영문명</label>
            <input
              name={editMode === "menu" ? "menu_name_en" : "option_name_en"}
              value={
                editMode === "menu"
                  ? selectedItem?.menu_name_en || ""
                  : selectedItem?.option_name_en || ""
              }
              onChange={handleInputChange}
            />
          </div>

          {editMode === "menu" && (
            <>
              <div className="form-group">
                <label>카테고리</label>
                <input
                  name="category"
                  value={selectedItem?.category || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>설명</label>
                <input
                  name="description"
                  value={selectedItem?.description || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>영문 설명</label>
                <input
                  name="description_en"
                  value={selectedItem?.description_en || ""}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>{editMode === "menu" ? "가격" : "추가 가격"}</label>
            <input
              type="number"
              step="100"
              min="0"
              name={editMode === "menu" ? "price" : "option_price"}
              value={
                editMode === "menu"
                  ? (selectedItem?.price ?? "")
                  : (selectedItem?.option_price ?? "")
              }
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>사진</label>

            <label className="image-upload">
              <span>사진 선택 (버튼클릭)</span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>

          <div className="form-group">
            <label>상태</label>
            <select
              name={
                editMode === "menu" ? "is_available" : "option_is_available"
              }
              value={
                editMode === "menu"
                  ? selectedItem?.is_available
                  : selectedItem?.option_is_available
              }
              onChange={handleInputChange}
            >
              <option value={true}>판매중</option>
              <option value={false}>품절</option>
            </select>
          </div>
        </div>
        <div className="edit-bottom">
          <button
            className="edit-back-btn"
            onClick={() => navigate("/adminmenu")}
          >
            뒤로가기
          </button>
          <button
            className="save-btn"
            onClick={() => {
              if (editMode === "menu") {
                if (isAddMode) {
                  handleAddMenu();
                } else {
                  handleSave();
                }
              } else {
                if (isAddMode) {
                  handleAddOption();
                } else {
                  handleSaveOption();
                }
              }
            }}
          >
            {editMode === "menu"
              ? isAddMode
                ? "메뉴 등록"
                : "메뉴 정보 수정"
              : isAddMode
                ? "옵션 등록"
                : "옵션 정보 수정"}
          </button>
        </div>
      </div>

      <ImagePreviewModal
        imageUrl={enlargedImage?.imageUrl}
        alt={enlargedImage?.alt}
        onClose={() => setEnlargedImage(null)}
      />
    </div>
  );
}
