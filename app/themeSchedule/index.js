
const DEFAULT_PROPERTIES = {
  id: undefined,
  scheduleAt: undefined,
  fileKey: "",
  fileValue: "",
  ownerId: undefined,
  backupId: undefined,
  description: "",
  deployed: false
};

class ThemeSchedule {
  constructor({
                id,
                scheduleAt,
                fileKey,
                fileValue,
                ownerId,
                backupId,
                description,
                deployed
              } = {}) {
    this.id = id || DEFAULT_PROPERTIES.id;
    this.scheduleAt = scheduleAt || DEFAULT_PROPERTIES.scheduleAt;
    this.fileKey = fileKey || DEFAULT_PROPERTIES.fileKey;
    this.fileValue = fileValue || DEFAULT_PROPERTIES.fileValue;
    this.ownerId = ownerId || DEFAULT_PROPERTIES.ownerId;
    this.backupId = backupId || DEFAULT_PROPERTIES.backupId;
    this.description = description || DEFAULT_PROPERTIES.description;
    this.deployed = deployed || DEFAULT_PROPERTIES.deployed;
  }
}

module.exports = ThemeSchedule;