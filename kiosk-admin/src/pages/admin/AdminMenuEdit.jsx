import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { validateMenu, validateOption } from "../../utils/validation";
import { createMenuFormData } from "../../utils/menuFormData";
import useMenuStore from "../../store/menuStore";
import useOptionStore from "../../store/optionStore";
import ImagePreviewModal from "../../components/admin/shared/ImagePreviewModal";
import MenuListSection from "../../components/admin/menu-edit/MenuListSection";
import OptionListSection from "../../components/admin/menu-edit/OptionListSection";
import MenuEditorForm from "../../components/admin/menu-edit/MenuEditorForm";
import OptionEditorForm from "../../components/admin/menu-edit/OptionEditorForm";
import "../../styles/AdminMenuEdit.css";
import bunshikLogo from "../../images/bunshiklogo.png";

export default function AdminMenuEdit() {
  const navigate = useNavigate();
  const {
    menuList,
    loadMenus,
    addMenu,
    editMenu,
    loadSetComponents,
    stopMenu,
    resumeMenu,
  } = useMenuStore();
  const { optionList, loadOptions, addOption, editOption, stopOption, resumeOption, } = useOptionStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState("menu");
  const [isAddMode, setIsAddMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [selectedComponentIds, setSelectedComponentIds] = useState([]);
  const [componentSettings, setComponentSettings] = useState({});
  const [isComponentsLoading, setIsComponentsLoading] = useState(false);
  const location = useLocation();
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
      setSelectedComponentIds([]);
      setComponentSettings({});

      if (location.state.type === "menu") {
        setSelectedItem({ menu_name: "", menu_name_en: "", menu_type: location.state.menuType || "NORMAL", category: "", price: 0, is_available: true, image_url: "", description: "", description_en: "",
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
    let ignore = false;

    const fetchSetComponents = async () => {
      if (
        editMode !== "menu" ||
        isAddMode ||
        !selectedItem?.menu_id ||
        selectedItem.category?.trim() !== "세트"
      ) {
        setSelectedComponentIds([]);
        setComponentSettings({});
        return;
      }

      setIsComponentsLoading(true);

      try {
        const components = await loadSetComponents(selectedItem.menu_id);

        if (!ignore) {
          setSelectedComponentIds(
            components.map((component) => component.menu_id),
          );
          setComponentSettings(Object.fromEntries(
            components.map((component) => [component.menu_id, {
              select_group: component.select_group || "",
              group_max_select: 1,
              extra_price: component.extra_price || 0,
            }]),
          ));
        }
      } catch (error) {
        if (!ignore) {
          console.error("세트 구성 조회 실패:", error);
          alert("세트 구성을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setIsComponentsLoading(false);
        }
      }
    };

    fetchSetComponents();

    return () => {
      ignore = true;
    };
  }, [
    editMode,
    isAddMode,
    loadSetComponents,
    selectedItem?.category,
    selectedItem?.menu_id,
  ]);

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

    if (
      selectedItem.category?.trim() === "세트" &&
      selectedComponentIds.length === 0
    ) {
      alert("세트 메뉴는 구성 메뉴를 한 개 이상 선택해야 합니다.");
      return;
    }

    try {
      const formData = createMenuFormData(
        selectedItem,
        imageFile,
        selectedComponentIds,
        componentSettings,
      );
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

    if (
      selectedItem.category?.trim() === "세트" &&
      selectedComponentIds.length === 0
    ) {
      alert("세트 메뉴는 구성 메뉴를 한 개 이상 선택해야 합니다.");
      return;
    }

    try {
      const formData = createMenuFormData(
        selectedItem,
        imageFile,
        selectedComponentIds,
        componentSettings,
      );

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
    if (!item.is_visible) {
      alert("판매중단된 항목은 판매재개 후 수정할 수 있습니다.");
      return;
    }

    setEditMode(type);
    setSelectedItem(item);
    setImageFile(null);
    setImagePreviewUrl(null);
    setIsAddMode(false);
  };
  const handleStartAddMenu = (category = "", menuType = "NORMAL") => {
    setEditMode("menu");
    setIsAddMode(true);
    setImageFile(null);
    setImagePreviewUrl(null);
    setSelectedComponentIds([]);
    setComponentSettings({});
    setSelectedItem({
      menu_name: "",
      menu_name_en: "",
      menu_type: menuType,
      category,
      price: 0,
      is_available: true,
      image_url: "",
      description: "",
      description_en: "",
    });
  };
  const handleStartAddOption = () => {
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
  };
  const handleComponentToggle = (menuId) => {
    setSelectedComponentIds((currentIds) =>
      currentIds.includes(menuId)
        ? currentIds.filter((id) => id !== menuId)
        : [...currentIds, menuId],
    );
    setComponentSettings((current) => ({
      ...current,
      [menuId]: current[menuId] || {
        select_group: "",
        group_max_select: 1,
        extra_price: 0,
      },
    }));
  };
  const handleComponentSettingChange = (menuId, field, value) => {
    setComponentSettings((current) => ({
      ...current,
      [menuId]: {
        ...(current[menuId] || {}),
        [field]: field === "select_group" ? value : Number(value),
        group_max_select: 1,
      },
    }));
  };
  // 메뉴와 옵션 이름 수정
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      ...(name === "category" && value === "세트"
        ? { menu_type: "NORMAL" }
        : {}),
      ...(name === "menu_type" && value === "COMPONENT"
        ? { price: 0 }
        : {}),
      [name]:
        name === "price" || name === "option_price"
          ? value === ""
            ? ""
            : Number(value)
          : name === "is_available" || name === "option_is_available"
            ? value === "true"
          : name === "base_is_available"
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
        <MenuListSection
          menus={menuList}
          onAddMenu={() => handleStartAddMenu()}
          onAddSetMenu={() => handleStartAddMenu("세트")}
          onAddComponentMenu={() => handleStartAddMenu("", "COMPONENT")}
          onEdit={handleEditClick}
          onToggleVisibility={handleToggleMenu}
          onImageClick={handleImageClick}
        />
        <OptionListSection
          options={optionList}
          onAdd={handleStartAddOption}
          onEdit={handleEditClick}
          onToggleVisibility={handleToggleOption}
          onImageClick={handleImageClick}
        />
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

          {editMode === "menu" ? (
            <MenuEditorForm
              item={selectedItem}
              menus={menuList}
              isComponentsLoading={isComponentsLoading}
              selectedComponentIds={selectedComponentIds}
              componentSettings={componentSettings}
              onChange={handleInputChange}
              onImageChange={handleImageChange}
              onComponentToggle={handleComponentToggle}
              onComponentSettingChange={handleComponentSettingChange}
            />
          ) : (
            <OptionEditorForm
              item={selectedItem}
              onChange={handleInputChange}
              onImageChange={handleImageChange}
            />
          )}
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
