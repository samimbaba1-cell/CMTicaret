const Product = require('../models/Product');
const emailService = require('./emailService');

class InventoryService {
  // Check for low stock products
  async checkLowStock() {
    try {
      const lowStockProducts = await Product.find({
        $expr: { $lte: ['$stock', '$minStock'] },
        stock: { $gt: 0 } // Not completely out of stock
      }).populate('category');

      return lowStockProducts;
    } catch (error) {
      console.error('Error checking low stock:', error);
      return [];
    }
  }

  // Check for out of stock products
  async checkOutOfStock() {
    try {
      const outOfStockProducts = await Product.find({
        stock: { $lte: 0 }
      }).populate('category');

      return outOfStockProducts;
    } catch (error) {
      console.error('Error checking out of stock:', error);
      return [];
    }
  }

  // Send low stock alert to admin
  async sendLowStockAlert(products) {
    if (products.length === 0) return;

    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Düşük Stok Uyarısı - CM Ticaret</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .product-list { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
            th { background: #f3f4f6; font-weight: bold; }
            .low-stock { color: #f59e0b; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CM Ticaret</h1>
              <h2>Düşük Stok Uyarısı</h2>
            </div>
            
            <div class="content">
              <p>Aşağıdaki ürünlerin stokları minimum seviyenin altına düşmüştür:</p>
              
              <div class="product-list">
                <table>
                  <thead>
                    <tr>
                      <th>Ürün Adı</th>
                      <th>Kategori</th>
                      <th>Mevcut Stok</th>
                      <th>Min. Stok</th>
                      <th>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${products.map(product => `
                      <tr>
                        <td>${product.name}</td>
                        <td>${product.category?.name || 'Kategori yok'}</td>
                        <td class="low-stock">${product.stock}</td>
                        <td>${product.minStock}</td>
                        <td>₺${Number(product.price || 0).toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              
              <p>Lütfen bu ürünlerin stoklarını güncelleyin.</p>
            </div>
            
            <div class="footer">
              <p>CM Ticaret - Envanter Yönetim Sistemi</p>
              <p>Bu e-posta otomatik olarak gönderilmiştir.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // In a real application, you would get admin email from database
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@cmticaret.com';
      
      const mailOptions = {
        from: `"CM Ticaret" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `Düşük Stok Uyarısı - ${products.length} ürün`,
        html: html,
      };

      await emailService.transporter.sendMail(mailOptions);
      console.log('Low stock alert sent to admin');
    } catch (error) {
      console.error('Error sending low stock alert:', error);
    }
  }

  // Send out of stock alert to admin
  async sendOutOfStockAlert(products) {
    if (products.length === 0) return;

    try {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Stok Tükendi Uyarısı - CM Ticaret</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 20px; }
            .product-list { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
            th { background: #f3f4f6; font-weight: bold; }
            .out-of-stock { color: #dc2626; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CM Ticaret</h1>
              <h2>Stok Tükendi Uyarısı</h2>
            </div>
            
            <div class="content">
              <p>Aşağıdaki ürünlerin stokları tükenmiştir:</p>
              
              <div class="product-list">
                <table>
                  <thead>
                    <tr>
                      <th>Ürün Adı</th>
                      <th>Kategori</th>
                      <th>Stok Durumu</th>
                      <th>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${products.map(product => `
                      <tr>
                        <td>${product.name}</td>
                        <td>${product.category?.name || 'Kategori yok'}</td>
                        <td class="out-of-stock">Stok Yok (${product.stock})</td>
                        <td>₺${Number(product.price || 0).toFixed(2)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              
              <p>Bu ürünler artık satışa sunulamaz. Lütfen acilen stok güncellemesi yapın.</p>
            </div>
            
            <div class="footer">
              <p>CM Ticaret - Envanter Yönetim Sistemi</p>
              <p>Bu e-posta otomatik olarak gönderilmiştir.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@cmticaret.com';
      
      const mailOptions = {
        from: `"CM Ticaret" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `Stok Tükendi Uyarısı - ${products.length} ürün`,
        html: html,
      };

      await emailService.transporter.sendMail(mailOptions);
      console.log('Out of stock alert sent to admin');
    } catch (error) {
      console.error('Error sending out of stock alert:', error);
    }
  }

  // Run inventory check (to be called periodically)
  async runInventoryCheck() {
    console.log('Running inventory check...');
    
    const lowStockProducts = await this.checkLowStock();
    const outOfStockProducts = await this.checkOutOfStock();
    
    if (lowStockProducts.length > 0) {
      await this.sendLowStockAlert(lowStockProducts);
    }
    
    if (outOfStockProducts.length > 0) {
      await this.sendOutOfStockAlert(outOfStockProducts);
    }
    
    console.log(`Inventory check completed. Low stock: ${lowStockProducts.length}, Out of stock: ${outOfStockProducts.length}`);
  }
}

module.exports = new InventoryService();
