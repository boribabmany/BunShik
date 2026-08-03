export default function SetComponentsField({
  menus,
  isLoading,
  selectedIds,
  settings,
  onToggle,
  onSettingChange,
}) {
  return (
    <div className="set-components-field">
      <span className="set-components-label">구성 메뉴</span>
      <div className="set-components-list">
        {isLoading ? (
          <p className="set-components-message">
            구성 메뉴를 불러오는 중입니다.
          </p>
        ) : menus.length === 0 ? (
          <p className="set-components-message">
            선택할 일반 메뉴가 없습니다.
          </p>
        ) : (
          menus.map((menu) => {
            const isSelected = selectedIds.includes(menu.menu_id);
            const componentSetting = settings[menu.menu_id] || {};

            return (
              <div key={menu.menu_id} className="set-component-option">
                <label className="set-component-check">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(menu.menu_id)}
                  />
                  <span>{menu.menu_name}</span>
                  <small>{menu.category}</small>
                </label>

                {isSelected && (
                  <div className="set-component-settings">
                    <label>
                      <span>선택 그룹</span>
                      <input
                        placeholder="비우면 고정"
                        value={componentSetting.select_group || ""}
                        onChange={(event) =>
                          onSettingChange(
                            menu.menu_id,
                            "select_group",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <label>
                      <span>최대 선택 수</span>
                      <input
                        type="number"
                        min="1"
                        disabled={!componentSetting.select_group}
                        value={componentSetting.group_max_select || 1}
                        onChange={(event) =>
                          onSettingChange(
                            menu.menu_id,
                            "group_max_select",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <label>
                      <span>추가 금액</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={componentSetting.extra_price || 0}
                        onChange={(event) =>
                          onSettingChange(
                            menu.menu_id,
                            "extra_price",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
