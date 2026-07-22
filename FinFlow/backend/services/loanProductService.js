// backend/services/loanProductService.js
const LoanProduct = require('../models/LoanProduct');

class LoanProductService {
  async getAllProducts({ includeInactive = false } = {}) {
    const filter = includeInactive ? {} : { isActive: true };
    return LoanProduct.find(filter).sort({ createdAt: -1 });
  }

  async getProductById(id) {
    return LoanProduct.findById(id);
  }

  async createProduct(productData) {
    return LoanProduct.create({
      ...productData,
      isActive: productData.isActive ?? true,
    });
  }

  async updateProduct(id, updateData) {
    return LoanProduct.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(id) {
    return LoanProduct.findByIdAndDelete(id);
  }
}

module.exports = new LoanProductService();