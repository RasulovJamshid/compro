-- AlterTable
ALTER TABLE "properties" ADD COLUMN "panorama360Id" TEXT;

-- Add comment for documentation
COMMENT ON COLUMN "properties"."panorama360Id" IS 'ID of tiled panorama (links to /uploads/tiles/{id}/)';
