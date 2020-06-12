
const DEFAULT_PROPERTIES = {
  id: undefined,
  fileKey: "",
  fileValue: "",
  ownerId: undefined,
  get createdAt() {
    return new Date()
  },
};

class ThemeBackup {
  constructor({
                id,
                createdAt,
                fileKey,
                fileValue,
                ownerId
              } = {}) {
    this.id = id || DEFAULT_PROPERTIES.id;
    this.createdAt = createdAt || DEFAULT_PROPERTIES.createdAt;
    this.fileKey = fileKey || DEFAULT_PROPERTIES.fileKey;
    this.fileValue = fileValue || DEFAULT_PROPERTIES.fileValue;
    this.ownerId = ownerId || DEFAULT_PROPERTIES.ownerId;
  }
}

module.exports = ThemeBackup;