# IRG Admin Product Guide

## Access

Open `/admin/products` while signed in as an ADMIN user. In local development, use `admin@irg.com` / `password` after running the seed. Customers receive an admin access error and cannot use the admin API.

## Add a product

1. Open `/admin/products` and select **Add New Product**.
2. Enter the name, unique slug, description, price in KES, category, and variants.
3. Add each size/color combination with its variant price and stock quantity.
4. Upload one or more product images, then select **Create product**. The product appears in the homepage collection and the shop.

## Add a product image

1. In the **Product images** section, select the image file from your computer.
2. Use JPEG, PNG, WebP, or AVIF images up to 5 MB each.
3. Wait for the uploaded image preview before saving. Uploaded files are stored in Vercel Blob and remain available in production.

## Edit products

Select **Edit** in the product table to change the name, description, price, category, slug, images, variants, or stock. Select **Save changes**; the existing product is updated and its variants are replaced in one transaction.

## Featured, stock, and deletion

- All products appear in the homepage collection, newest first.
- Change the `stock` value on the relevant size/color variant and save.
- Select **Delete**, then confirm. Products already referenced by an order are protected from deletion.
