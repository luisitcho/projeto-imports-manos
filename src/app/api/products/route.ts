import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dataFile = path.join(process.cwd(), 'data', 'products.json');
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories and file exist
if (!fs.existsSync(path.join(process.cwd(), 'data'))) fs.mkdirSync(path.join(process.cwd(), 'data'));
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]');

function getProducts() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveProducts(products: any[]) {
    fs.writeFileSync(dataFile, JSON.stringify(products, null, 2));
}

export async function GET() {
    return NextResponse.json(getProducts());
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { nome, preco, valor, foto, categoria } = body;

        const id = crypto.randomUUID();

        // Handle Base64 Image
        if (foto && foto.startsWith('data:image')) {
            const matches = foto.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const buffer = Buffer.from(matches[2], 'base64');
                const ext = matches[1].split('/')[1] || 'webp';
                const filename = `${id}.${ext}`;
                fs.writeFileSync(path.join(uploadsDir, filename), buffer);
                foto = `/uploads/${filename}`;
            }
        }

        const newProduct = { id, nome, preco, valor, foto, categoria };
        const products = getProducts();
        products.push(newProduct);
        saveProducts(products);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}
