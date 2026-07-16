import {
  getOptions,
  createOption,
  updateOption,
  deleteOption,
} from "../api/optionApi";

describe("optionApi", () => {
  test("옵션 조회", async () => {
    const options = await getOptions();

    expect(options).toBeDefined();
    expect(Array.isArray(options)).toBe(true);
    expect(options.length).toBeGreaterThan(0);
  });

  test("옵션 등록", async () => {
    const newOption = {
      option_name: "테스트옵션",
      option_price: 1000,
      option_image: "test.jpg",
      option_is_available: true,
    };

    await createOption(newOption);

    const options = await getOptions();

    expect(
      options.some((option) => option.option_name === "테스트옵션")
    ).toBe(true);
  });

  test("옵션 수정", async () => {
    const options = await getOptions();

    const option = {
      ...options[0],
      option_name: "수정된옵션",
    };

    await updateOption(option);

    const updatedOptions = await getOptions();

    expect(updatedOptions[0].option_name).toBe("수정된옵션");
  });

  test("옵션 삭제", async () => {
    const options = await getOptions();

    const deleteId = options[0].option_id;

    await deleteOption(deleteId);

    const updatedOptions = await getOptions();

    expect(
      updatedOptions.find((option) => option.option_id === deleteId)
    ).toBeUndefined();
  });
});