export function initSettingsPanel(
  {
    settingsTab,
    settingsOverlay,
    settingsClose,
    coordsToggle,
    moveSelect,
    combatSelect,
    colorblindToggle,
    labelToggle,
    dialogueToggle,
    langSelect,
    centerToggle,
    resetBtn,
    rollbackRow,
    rollbackSelect,
    rollbackBtn,
  },
  settings,
  applySettings,
  saveSettings,
  loadLanguage,
  DEFAULT_SETTINGS,
  rollbackTo
) {
  if (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.NODE_ENV !== 'development'
  ) {
    rollbackRow.style.display = 'none';
  }

  function showSettings() {
    settingsOverlay.classList.add('active');
  }
  function hideSettings() {
    settingsOverlay.classList.remove('active');
  }

  settingsTab.addEventListener('click', showSettings);
  settingsClose.addEventListener('click', hideSettings);
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) hideSettings();
  });

  coordsToggle.addEventListener('change', () => {
    settings.gridCoordinates = coordsToggle.checked;
    applySettings(settings);
    saveSettings(settings);
  });

  moveSelect.addEventListener('change', () => {
    settings.movementSpeed = moveSelect.value;
    saveSettings(settings);
  });

  combatSelect.addEventListener('change', () => {
    settings.combatSpeed = combatSelect.value;
    saveSettings(settings);
  });

  colorblindToggle.addEventListener('change', () => {
    settings.colorblind = colorblindToggle.checked;
    applySettings(settings);
    saveSettings(settings);
  });

  labelToggle.addEventListener('change', () => {
    settings.tileLabels = labelToggle.checked;
    applySettings(settings);
    saveSettings(settings);
  });

  dialogueToggle.addEventListener('change', () => {
    settings.dialogueAnim = dialogueToggle.checked;
    saveSettings(settings);
  });

  langSelect.addEventListener('change', () => {
    settings.language = langSelect.value;
    saveSettings(settings);
    loadLanguage(settings.language);
  });

  centerToggle.addEventListener('change', () => {
    settings.centerMode = centerToggle.checked;
    saveSettings(settings);
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Reset all settings?')) {
      Object.assign(settings, DEFAULT_SETTINGS);
      saveSettings(settings);
      applySettings(settings);
      coordsToggle.checked = settings.gridCoordinates;
      moveSelect.value = settings.movementSpeed;
      combatSelect.value = settings.combatSpeed;
      colorblindToggle.checked = settings.colorblind;
      labelToggle.checked = settings.tileLabels;
      dialogueToggle.checked = settings.dialogueAnim;
      langSelect.value = settings.language;
      centerToggle.checked = settings.centerMode;
      loadLanguage(settings.language);
    }
  });

  rollbackBtn.addEventListener('click', () => {
    rollbackTo(rollbackSelect.value);
    alert(`Rolled back to ${rollbackSelect.value}`);
  });
}
