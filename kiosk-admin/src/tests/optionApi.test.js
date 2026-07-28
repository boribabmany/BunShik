import api from "../api/axios";
import {
  getOptions,
  createOption,
  updateOption,
  deleteOption,
} from "../api/optionApi";

jest.mock("../api/axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("optionApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("옵션 조회 응답을 화면용 데이터로 변환한다", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            optionId: 1,
            optionName: "치즈",
            optionPrice: 1000,
            optionImage: "/images/cheese.png",
            optionIsAvailable: true,
          },
        ],
      },
    });

    const options = await getOptions();

    expect(api.get).toHaveBeenCalledWith("/api/admin/options");
    expect(options).toEqual([
      {
        option_id: 1,
        option_name: "치즈",
        option_price: 1000,
        option_image: "http://localhost:8080/images/cheese.png",
        option_is_available: true,
      },
    ]);
  });

  test("옵션 등록 데이터를 multipart 요청으로 전송한다", async () => {
    const option = {
      option_name: "계란",
      option_price: "1000",
      option_is_available: true,
    };
    const file = new File(["image"], "egg.png", { type: "image/png" });
    const createdOption = { optionId: 2, optionName: "계란" };
    api.post.mockResolvedValue({ data: { data: createdOption } });

    await expect(createOption(option, file)).resolves.toEqual(createdOption);

    const [url, formData, config] = api.post.mock.calls[0];
    expect(url).toBe("/api/admin/options");
    expect(JSON.parse(formData.get("option"))).toEqual({
      optionName: "계란",
      optionPrice: 1000,
      optionIsAvailable: true,
    });
    expect(formData.get("file")).toBe(file);
    expect(config).toEqual({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });

  test("옵션 수정 요청에 옵션 ID와 multipart 데이터를 전달한다", async () => {
    const option = {
      option_name: "추가 치즈",
      option_price: 1500,
      option_is_available: false,
    };
    const updatedOption = { optionId: 3, optionName: "추가 치즈" };
    api.put.mockResolvedValue({ data: { data: updatedOption } });

    await expect(updateOption(3, option)).resolves.toEqual(updatedOption);

    const [url, formData, config] = api.put.mock.calls[0];
    expect(url).toBe("/api/admin/options/3");
    expect(JSON.parse(formData.get("option"))).toEqual({
      optionName: "추가 치즈",
      optionPrice: 1500,
      optionIsAvailable: false,
    });
    expect(formData.has("file")).toBe(false);
    expect(config).toEqual({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });

  test("옵션 삭제 요청을 전송하고 응답 데이터를 반환한다", async () => {
    const deletedOption = { optionId: 1 };
    api.delete.mockResolvedValue({ data: { data: deletedOption } });

    await expect(deleteOption(1)).resolves.toEqual(deletedOption);
    expect(api.delete).toHaveBeenCalledWith("/api/admin/options/1");
  });
});
