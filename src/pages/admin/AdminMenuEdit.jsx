import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminMenuEdit() {
  const navigate = useNavigate();

  const [menuList] = useState([
    { id: 1, name: "야채김밥", category: "김밥", price: 2500, status: "판매중" },
    { id: 2, name: "라면", category: "라면", price: 3500, status: "판매중" },
    { id: 3, name: "떡볶이", category: "떡볶이", price: 4000, status: "판매중" },
  ]);

  const [optionList] = useState([
    { id: 1, name: "치즈", price: 500, status: "판매중" },
    { id: 2, name: "계란", price: 700, status: "판매중" },
    { id: 3, name: "라면사리", price: 1000, status: "품절" },
  ]);

  const [editMode, setEditMode] = useState("menu");

  const [selectedItem, setSelectedItem] = useState(menuList[0]);

  const handleEditClick = (type, item) => {
    setEditMode(type);
    setSelectedItem(item);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    
    setSelectedItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>

      <div>

        <h2>메뉴 목록</h2>

        <table>
          <thead>
            <tr>
              <th>메뉴명</th>
              <th>카테고리</th>
              <th>가격</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {menuList.map((menu) => (
              <tr key={menu.id}>
                <td>{menu.name}</td>
                <td>{menu.category}</td>
                <td>{menu.price.toLocaleString()}원</td>
                <td>{menu.status}</td>

                <td>
                  <button
                    onClick={() => handleEditClick("menu", menu)}
                  >
                    수정
                  </button>

                  <button>
                    삭제
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>


        <h2>옵션 목록</h2>

        <table>

          <thead>
            <tr>
              <th>옵션명</th>
              <th>추가 가격</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>


          <tbody>

            {optionList.map((option) => (

              <tr key={option.id}>

                <td>{option.name}</td>

                <td>
                  +{option.price.toLocaleString()}원
                </td>

                <td>
                  {option.status}
                </td>

                <td>

                  <button
                    onClick={() =>
                      handleEditClick("option", option)
                    }
                  >
                    수정
                  </button>

                  <button>
                    삭제
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>


        <button
          onClick={() => navigate("/adminmenu")}
        >
          뒤로가기
        </button>


      </div>



      <div>


        <div>

          <div>
            {editMode === "menu" ? "메뉴수정" : "옵션수정"}
          </div>


          <h3>
            {selectedItem.name}
          </h3>

        </div>



        <div>


          <label>
            {editMode === "menu" ? "메뉴명" : "옵션명"}
          </label>

          <input
            name="name"
            value={selectedItem.name || ""}
            onChange={handleInputChange}
          />



          {editMode === "menu" && (

            <>
              <label>
                카테고리
              </label>

              <input
                name="category"
                value={selectedItem.category || ""}
                onChange={handleInputChange}
              />
            </>

          )}



          <label>
            {editMode === "menu" ? "가격" : "추가 가격"}
          </label>


          <input
            type="number"
            name="price"
            value={selectedItem.price || 0}
            onChange={handleInputChange}
          />



          <label>
            상태
          </label>


          <select
            name="status"
            value={selectedItem.status}
            onChange={handleInputChange}
          >

            <option value="판매중">
              판매중
            </option>

            <option value="품절">
              품절
            </option>


            {editMode === "menu" && (
              <option value="숨김">
                숨김
              </option>
            )}

          </select>



          {editMode === "menu" && (

            <div>
              +
            </div>

          )}



          <button>
            {editMode === "menu"
              ? "메뉴 정보 수정"
              : "옵션 정보 수정"
            }
          </button>


        </div>


      </div>


    </div>
  );
}