# IRG Admin Product Guide

## Access

Open `/admin/products` while signed in as an ADMIN user. In local development, use `admin@irg.com` / `password` after running the seed. Customers receive an admin access error and cannot use the admin API.

## Add a product

1. Open `/admin/products` and select **Add New Product**.
2. Enter the name, unique slug, description, price in KES, category, and variants.
3. Add each size/color combination with its variant price and stock quantity.
4. Add one or more image paths and select **Create product**. The product is immediately available on the storefront.

## Add a product image

1. Put the image file in `public/images/products/`.
2. Use a clear filename such as `shirt-01.png`.
3. Enter `/images/products/shirt-01.png` in the Image paths field. This keeps Next.js image optimization working through the existing local image setup.

## Edit products

Select **Edit** in the product table to change the name, description, price, category, slug, featured status, images, variants, or stock. Select **Save changes**; the existing product is updated and its variants are replaced in one transaction.

## Featured, stock, and deletion

- Check **Featured product** to include the product in the homepage featured section.
- Change the `stock` value on the relevant size/color variant and save.
- Select **Delete**, then confirm. Products already referenced by an order are protected from deletion.
