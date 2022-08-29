-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostsOnTags" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("postId", "tagId"),
    CONSTRAINT "PostsOnTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostsOnTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostsOnTags" ("postId", "tagId") SELECT "postId", "tagId" FROM "PostsOnTags";
DROP TABLE "PostsOnTags";
ALTER TABLE "new_PostsOnTags" RENAME TO "PostsOnTags";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
