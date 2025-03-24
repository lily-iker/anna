import { Truck, Phone, Tag } from "lucide-react";

const Feature = () => {
  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
        <div className="flex flex-col items-center">
          <Truck className="h-10 w-10 text-emerald-500 mb-2" />
          <h4 className="text-base font-semibold text-gray-900 mb-1">Miễn phí vận chuyển</h4>
          <p className="text-sm text-gray-600 max-w-xs">
            Cam kết giao hàng nhanh chóng và chất lượng đến tay khách hàng
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Phone className="h-10 w-10 text-emerald-500 mb-2" />
          <h4 className="text-base font-semibold text-gray-900 mb-1">Đội ngũ thân thiện</h4>
          <p className="text-sm text-gray-600 max-w-xs">
            Đội ngũ thân thiện, dịch vụ tận tâm!
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Tag className="h-10 w-10 text-emerald-500 mb-2" />
          <h4 className="text-base font-semibold text-gray-900 mb-1">Ưu đãi đặc biệt</h4>
          <p className="text-sm text-gray-600 max-w-xs">
            Ưu đãi hấp dẫn, mua sắm dễ dàng!
          </p>
        </div>
      </div>
  );
};

export default Feature;
