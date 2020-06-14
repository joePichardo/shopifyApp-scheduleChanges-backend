
const DEFAULT_PROPERTIES = {
  id: undefined,
  scheduleAt: undefined,
  fileKey: "",
  fileValue: "",
  ownerId: undefined,
  backupId: undefined
};

class ThemeSchedule {
  constructor({
                id,
                scheduleAt,
                fileKey,
                fileValue,
                ownerId,
                backupId
              } = {}) {
    this.id = id || DEFAULT_PROPERTIES.id;
    this.scheduleAt = scheduleAt || DEFAULT_PROPERTIES.scheduleAt;
    this.fileKey = fileKey || DEFAULT_PROPERTIES.fileKey;
    this.fileValue = fileValue || DEFAULT_PROPERTIES.fileValue;
    this.ownerId = ownerId || DEFAULT_PROPERTIES.ownerId;
    this.backupId = backupId || DEFAULT_PROPERTIES.backupId;
  }
}

module.exports = ThemeSchedule;