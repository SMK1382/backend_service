import 'dotenv/config'
import * as grpc from '@grpc/grpc-js'
import { userPackageDefinition, addUser, getUser, ListUsers, updateUser, deleteUser } from './grpc/user.grpc.js';
import { carBrandPackageDefinition, addCarBrand, getCarBrand, listCarBrands, updateCarBrand, deleteCarBrand } from './grpc/carBrand.grpc.js';
import { carModelPackageDefinition, addCarModel, getCarModel, listCarModels, updateCarModel, deleteCarModel } from './grpc/carModel.grpc.js';
import { categoryPackageDefinition, addCategory, getCategory, listCategories, updateCategory, deleteCategory } from './grpc/category.grpc.js';
import { partBrandPackageDefinition, addPartBrand, getPartBrand, listPartBrands, updatePartBrand, deletePartBrand } from './grpc/partBrand.grpc.js';
import { discountPackageDefinition, addDiscount, getDiscount, listDiscounts, updateDiscount, deleteDiscount } from './grpc/discount.grpc.js';
import { supplierPackageDefinition, addSupplier, getSupplier, listSuppliers, updateSupplier, deleteSupplier } from './grpc/supplier.grpc.js';
import { partPackageDefinition, addPart, getPart, listParts, updatePart, deletePart } from './grpc/part.grpc.js';
import { productImagePackageDefinition, addProductImage, getProductImage, listProductImages, updateProductImage, deleteProductImage } from './grpc/productImage.grpc.js';
import { partCompatibilityPackageDefinition, addPartCompatibility, getPartCompatibility, listPartCompatibilities, updatePartCompatibility, deletePartCompatibility } from './grpc/partCompatibility.grpc.js';
import { contactMessagePackageDefinition, addContactMessage, getContactMessage, listContactMessages, updateContactMessage, deleteContactMessage } from './grpc/contactMessage.grpc.js';
import { bannerPackageDefinition, addBanner, getBanner, listBanners, updateBanner, deleteBanner } from './grpc/banner.grpc.js';
import { addressPackageDefinition, addAddress, getAddress, listAddresses, updateAddress, deleteAddress } from './grpc/address.grpc.js';
import { orderPackageDefinition, addOrder, getOrder, listOrders, updateOrder, deleteOrder } from './grpc/order.grpc.js';
import { orderItemPackageDefinition, addOrderItem, getOrderItem, listOrderItems, updateOrderItem, deleteOrderItem } from './grpc/orderItem.grpc.js';
import { reviewPackageDefinition, addReview, getReview, listReviews, updateReview, deleteReview } from './grpc/review.grpc.js';
import { returnRequestPackageDefinition, addReturnRequest, getReturnRequest, listReturnRequests, updateReturnRequest, deleteReturnRequest } from './grpc/returnRequest.grpc.js';
import { wishlistPackageDefinition, addWishlist, getWishlist, listWishlist, updateWishlist, deleteWishlist } from './grpc/wishlist.grpc.js';
import { shoppingCartPackageDefinition, addShoppingCart, getShoppingCart, listShoppingCart, updateShoppingCart, deleteShoppingCart } from './grpc/shoppingCart.grpc.js';

const userProto = grpc.loadPackageDefinition(userPackageDefinition) as any
const carBrandProto = grpc.loadPackageDefinition(carBrandPackageDefinition) as any
const carModelProto = grpc.loadPackageDefinition(carModelPackageDefinition) as any
const categoryProto = grpc.loadPackageDefinition(categoryPackageDefinition) as any
const partBrandProto = grpc.loadPackageDefinition(partBrandPackageDefinition) as any
const discountProto = grpc.loadPackageDefinition(discountPackageDefinition) as any
const supplierProto = grpc.loadPackageDefinition(supplierPackageDefinition) as any
const partProto = grpc.loadPackageDefinition(partPackageDefinition) as any
const productImageProto = grpc.loadPackageDefinition(productImagePackageDefinition) as any
const partCompatibilityProto = grpc.loadPackageDefinition(partCompatibilityPackageDefinition) as any
const contactMessageProto = grpc.loadPackageDefinition(contactMessagePackageDefinition) as any
const bannerProto = grpc.loadPackageDefinition(bannerPackageDefinition) as any
const addressProto = grpc.loadPackageDefinition(addressPackageDefinition) as any
const orderProto = grpc.loadPackageDefinition(orderPackageDefinition) as any
const orderItemProto = grpc.loadPackageDefinition(orderItemPackageDefinition) as any
const reviewProto = grpc.loadPackageDefinition(reviewPackageDefinition) as any
const returnRequestProto = grpc.loadPackageDefinition(returnRequestPackageDefinition) as any
const wishlistProto = grpc.loadPackageDefinition(wishlistPackageDefinition) as any
const shoppingCartProto = grpc.loadPackageDefinition(shoppingCartPackageDefinition) as any



const server = new grpc.Server();

server.addService(userProto.user.UserService.service, {
    AddUser: addUser,
    GetUser: getUser,
    ListUsers: ListUsers,
    UpdateUser: updateUser,
    DeleteUser: deleteUser
});

server.addService(carBrandProto.carBrand.CarBrandService.service, {
    AddCarBrand: addCarBrand,
    GetCarBrand: getCarBrand,
    ListCarBrands: listCarBrands,
    UpdateCarBrand: updateCarBrand,
    DeleteCarBrand: deleteCarBrand
});

server.addService(carModelProto.carModel.CarModelService.service, {
    AddCarModel: addCarModel,
    GetCarModel: getCarModel,
    ListCarModels: listCarModels,
    UpdateCarModel: updateCarModel,
    DeleteCarModel: deleteCarModel
});

server.addService(categoryProto.category.CategoryService.service, {
    AddCategory: addCategory,
    GetCategory: getCategory,
    ListCategories: listCategories,
    UpdateCategory: updateCategory,
    DeleteCategory: deleteCategory
});

server.addService(partBrandProto.partBrand.PartBrandService.service, {
    AddPartBrand: addPartBrand,
    GetPartBrand: getPartBrand,
    ListPartBrands: listPartBrands,
    UpdatePartBrand: updatePartBrand,
    DeletePartBrand: deletePartBrand
});

server.addService(discountProto.discount.DiscountService.service, {
    AddDiscount: addDiscount,
    GetDiscount: getDiscount,
    ListDiscounts: listDiscounts,
    UpdateDiscount: updateDiscount,
    DeleteDiscount: deleteDiscount
});

server.addService(supplierProto.supplier.SupplierService.service, {
    AddSupplier: addSupplier,
    GetSupplier: getSupplier,
    ListSuppliers: listSuppliers,
    UpdateSupplier: updateSupplier,
    DeleteSupplier: deleteSupplier
});

server.addService(partProto.part.PartService.service, {
    AddPart: addPart,
    GetPart: getPart,
    ListParts: listParts,
    UpdatePart: updatePart,
    DeletePart: deletePart
});

server.addService(productImageProto.productImage.ProductImageService.service, {
    AddProductImage: addProductImage,
    GetProductImage: getProductImage,
    ListProductImages: listProductImages,
    UpdateProductImage: updateProductImage,
    DeleteProductImage: deleteProductImage
});

server.addService(partCompatibilityProto.partCompatibility.PartCompatibilityService.service, {
    AddPartCompatibility: addPartCompatibility,
    GetPartCompatibility: getPartCompatibility,
    ListPartCompatibilities: listPartCompatibilities,
    UpdatePartCompatibility: updatePartCompatibility,
    DeletePartCompatibility: deletePartCompatibility
});

server.addService(contactMessageProto.contactMessage.ContactMessageService.service, {
    AddContactMessage: addContactMessage,
    GetContactMessage: getContactMessage,
    ListContactMessages: listContactMessages,
    UpdateContactMessage: updateContactMessage,
    DeleteContactMessage: deleteContactMessage
});

server.addService(bannerProto.banner.BannerService.service, {
    AddBanner: addBanner,
    GetBanner: getBanner,
    ListBanners: listBanners,
    UpdateBanner: updateBanner,
    DeleteBanner: deleteBanner
});

server.addService(addressProto.address.AddressService.service, {
    AddAddress: addAddress,
    GetAddress: getAddress,
    ListAddresses: listAddresses,
    UpdateAddress: updateAddress,
    DeleteAddress: deleteAddress
});

server.addService(orderProto.order.OrderService.service, {
    AddOrder: addOrder,
    GetOrder: getOrder,
    ListOrders: listOrders,
    UpdateOrder: updateOrder,
    DeleteOrder: deleteOrder
});

server.addService(orderItemProto.orderItem.OrderItemService.service, {
    AddOrderItem: addOrderItem,
    GetOrderItem: getOrderItem,
    ListOrderItems: listOrderItems,
    UpdateOrderItem: updateOrderItem,
    DeleteOrderItem: deleteOrderItem
});

server.addService(reviewProto.review.ReviewService.service, {
    AddReview: addReview,
    GetReview: getReview,
    ListReviews: listReviews,
    UpdateReview: updateReview,
    DeleteReview: deleteReview
});

server.addService(returnRequestProto.returnRequest.ReturnRequestService.service, {
    AddReturnRequest: addReturnRequest,
    GetReturnRequest: getReturnRequest,
    ListReturnRequests: listReturnRequests,
    UpdateReturnRequest: updateReturnRequest,
    DeleteReturnRequest: deleteReturnRequest
});

server.addService(wishlistProto.wishlist.WishlistService.service, {
    AddWishlist: addWishlist,
    GetWishlist: getWishlist,
    ListWishlist: listWishlist,
    UpdateWishlist: updateWishlist,
    DeleteWishlist: deleteWishlist
});

server.addService(shoppingCartProto.shoppingCart.ShoppingCartService.service, {
    AddShoppingCart: addShoppingCart,
    GetShoppingCart: getShoppingCart,
    ListShoppingCart: listShoppingCart,
    UpdateShoppingCart: updateShoppingCart,
    DeleteShoppingCart: deleteShoppingCart
});

server.bindAsync(
    `127.0.0.1:${process.env.PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error("Server error:", error);
            return;
        }
        console.log(`gRPC server listening on port ${port}`)
    }
);