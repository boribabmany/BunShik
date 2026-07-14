import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {getMenus,createMenu,updateMenu,deleteMenu,} from "../../api/menuApi";
import {getOptions,createOption,updateOption,deleteOption,} from "../../api/optionApi";
import "../../styles/AdminMenuEdit.css";

export default function AdminMenuEdit() {
  const navigate = useNavigate();

 // DB 명에 따라 수정(목업 데이터)
  const [menuList, setMenuList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState("menu");

  //메뉴,옵션 리스트 (임시)
  const [isAddMode, setIsAddMode] = useState(false);
  useEffect(() => {
  const fetchData = async () => {
    const menus = await getMenus();
    const options = await getOptions();

    setMenuList(menus);
    setOptionList(options);

    if (menus.length > 0) {
      setSelectedItem(menus[0]);
    }
  };
  fetchData();
}, []);

  //메뉴삭제(임시)
  const handleDeleteMenu = async (menuId) => {
  if (!window.confirm("삭제하시겠습니까?")) return;
  await deleteMenu(menuId);
  const menus = await getMenus();
  setMenuList(menus);
  };
  //메뉴수정(임시)
  const handleSave = async() => {
  await updateMenu(selectedItem);

  const menus = await getMenus();
  setMenuList(menus);
  alert("수정되었습니다.");
  };

  //메뉴등록(임시)
  const handleAddMenu = async() => {
  await createMenu(selectedItem);

  const menus = await getMenus();
  setMenuList(menus);

  alert("등록되었습니다.");
  };
  const handleEditClick = (type, item) => {
    setEditMode(type);
    setSelectedItem(item);
    setIsAddMode(false);
  };
// 메뉴와 옵션 이름 수정
  const handleInputChange = (e) => {
  const { name, value } = e.target;

  setSelectedItem((prev) => ({
    ...prev,
    [name]:
      name === "is_available" ||
      name === "option_is_available"
        ? value === "true"
        : value,
  }));
};
//옵션삭제
const handleDeleteOption = async(optionId) => {
  if (!window.confirm("삭제하시겠습니까?")) return;

  await deleteOption(optionId);

const options = await getOptions();
setOptionList(options);
};

//옵션 수정
const handleSaveOption = async() => {
  await updateOption(selectedItem);

const options = await getOptions();
setOptionList(options);

alert("옵션이 수정되었습니다.");
};

// 옵션 등록
const handleAddOption = async () => {
  await createOption(selectedItem);

  const options = await getOptions();
  setOptionList(options);

  alert("옵션이 등록되었습니다.");
};

// ----------------------------------------------------------------
  return (
  <div className="admin-edit-page">

    {/* =========================
        왼쪽 영역
    ========================= */}
    <div className="edit-left">

      <h2 className="edit-title">
        관리자 메뉴수정 및 등록
      </h2>

      <div style={{ marginBottom: "10px" }}>
        <button
          className="register-btn"
          onClick={() => {
            setEditMode("menu");
            setIsAddMode(true);
            setSelectedItem({
              menu_name: "",
              category: "",
              price: 0,
              is_available: true,
              image_url: "",
            });
          }}
        >
          + 메뉴 등록
        </button>
      </div>

      {/* 메뉴 테이블 */}
      <div className="edit-table-box">
        <table className="edit-table">
          <thead>
            <tr>
              <th>사진</th>
              <th>메뉴명</th>
              <th>카테고리</th>
              <th>가격</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {menuList.map((menu) => (
              <tr key={menu.menu_id}>
                <td>
                  <img
                    src={menu.image_url}
                    alt={menu.menu_name}
                    width={60}
                    height={60}
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </td>

                <td>{menu.menu_name}</td>
                <td>{menu.category}</td>
                <td>{menu.price.toLocaleString()}원</td>
                <td>{menu.is_available ? "판매중" : "품절"}</td>

                <td>
                  <button onClick={() => handleEditClick("menu", menu)}>
                    수정
                  </button>

                  <button onClick={() => handleDeleteMenu(menu.menu_id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 옵션 등록 버튼 */}
      <div style={{ marginBottom: "10px" }}>
        <button
          className="register-btn"
          onClick={() => {
            setEditMode("option");
            setIsAddMode(true);
            setSelectedItem({
              option_name: "",
              option_price: 0,
              option_is_available: true,
              option_image: "",
            });
          }}
        >
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
              <th>추가 가격</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {optionList.map((option) => (
              <tr key={option.option_id}>
                <td>
                  <img
                    src={option.option_image}
                    alt={option.option_name}
                    width={60}
                    height={60}
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </td>

                <td>{option.option_name}</td>
                <td>+{option.option_price.toLocaleString()}원</td>
                <td>{option.option_is_available ? "판매중" : "품절"}</td>

                <td>
                  <button onClick={() => handleEditClick("option", option)}>
                    수정
                  </button>

                  <button onClick={() => handleDeleteOption(option.option_id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>




      {/* =========================
    오른쪽 수정 패널
========================= */}
<div className="edit-right">

  <div className="preview-box">
    <img
      src={
        editMode === "menu"
          ? selectedItem?.image_url
          : selectedItem?.option_image
      }
      alt={
        editMode === "menu"
          ? selectedItem?.menu_name
          : selectedItem?.option_name
      }
    />

    <h3 className="preview-name">
      {editMode === "menu"
        ? selectedItem?.menu_name
        : selectedItem?.option_name}
    </h3>
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

  {editMode === "menu" && (
    <div className="form-group">
      <label>카테고리</label>

      <input
        name="category"
        value={selectedItem?.category || ""}
        onChange={handleInputChange}
      />
    </div>
  )}

  <div className="form-group">
    <label>{editMode === "menu" ? "가격" : "추가 가격"}</label>

    <input
      type="number"
      name={editMode === "menu" ? "price" : "option_price"}
      value={
        editMode === "menu"
          ? selectedItem?.price || 0
          : selectedItem?.option_price || 0
      }
      onChange={handleInputChange}
    />
  </div>

  <div className="form-group">
    <label>사진</label>

    <input
      className="image-link"
      type="text"
      name={editMode === "menu" ? "image_url" : "option_image"}
      placeholder="이미지 경로 입력"
      value={
        editMode === "menu"
          ? selectedItem?.image_url || ""
          : selectedItem?.option_image || ""
      }
      onChange={handleInputChange}
    />
  </div>

  <div className="form-group">
    <label>상태</label>

    <select
      name={editMode === "menu" ? "is_available" : "option_is_available"}
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

  <div className="edit-bottom">

    <button
      className="back-btn"
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

</div>
  );}
//등록 수정 삭제 기능은 백엔드후에