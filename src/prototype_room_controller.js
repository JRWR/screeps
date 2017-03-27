'use strict';

Room.prototype.buildBase = function() {
  let resetCounters = function(room) {
    room.memory.controllerLevel.checkPathInterval = 1;
    room.memory.controllerLevel.checkWrongStructureInterval = 1;
    room.memory.controllerLevel.buildStructuresInterval = 1;
    room.memory.controllerLevel.buildBlockersInterval = 1;
  };

  this.memory.controllerLevel = this.memory.controllerLevel || {};

  if (!this.memory.controllerLevel['setup_level_' + this.controller.level]) {
    if (this.controller.level === 1) {
      if (!this.memory.position) {
        this.setup();
      }
    }
    resetCounters(this);
    this.memory.controllerLevel['setup_level_' + this.controller.level] = Game.time;
  }

  if (this.exectueEveryTicks(this.memory.controllerLevel.checkPathInterval)) {
    if (this.checkPath(this)) {
      resetCounters(this);
    } else {
      this.memory.controllerLevel.checkPathInterval++;
    }
  }

  if (!this.memory.controllerLevel.checkWrongStructureInterval) {
    this.memory.controllerLevel.checkWrongStructureInterval = 1;
  }
  if (this.memory.walls && this.memory.walls.finished && this.exectueEveryTicks(this.memory.controllerLevel.checkWrongStructureInterval)) {
    if (this.checkWrongStructure(this)) {
      resetCounters(this);
    } else {
      this.memory.controllerLevel.checkWrongStructureInterval++;
    }
  }

  // TODO Add build ramparts and walls

  if (!this.memory.controllerLevel.buildStructuresInterval) {
    this.memory.controllerLevel.buildStructuresInterval = 1;
  }
  if (this.exectueEveryTicks(this.memory.controllerLevel.buildStructuresInterval)) {
    if (this.buildStructures()) {
      this.memory.controllerLevel.buildStructuresInterval = 1;
    } else {
      this.memory.controllerLevel.buildStructuresInterval++;
    }
  }

  if (!this.memory.controllerLevel.checkBlockersInterval) {
    this.memory.controllerLevel.checkBlockersInterval = 1;
  }
  if (!this.memory.controllerLevel.buildBlockersInterval) {
    this.memory.controllerLevel.buildBlockersInterval = 1;
  }
  if (this.memory.controllerLevel.buildStructuresInterval > 1) {
    if (this.exectueEveryTicks(this.memory.controllerLevel.checkBlockersInterval)) {
      if (this.checkBlockers()) {
        this.memory.controllerLevel.checkBlockersInterval = 1;
      } else {
        this.memory.controllerLevel.checkBlockersInterval++;
      }
    }
    if (this.exectueEveryTicks(this.memory.controllerLevel.buildBlockersInterval)) {
      if (this.controller.level >= 2) {
        if (this.buildBlockers()) {
          this.memory.controllerLevel.buildBlockersInterval = 1;
        } else {
          this.memory.controllerLevel.buildBlockersInterval++;
        }
      }
    }
  }

  // version: this.memory.position.version is maybe not the best idea
  if (!this.memory.position || this.memory.position.version != config.layout.version) {
    this.setup();
  }
};

Room.prototype.clearRoom = function() {
  var structures = this.find(FIND_STRUCTURES);
  for (var structures_i in structures) {
    structures[structures_i].destroy();
  }
  var constructionSites = this.find(FIND_CONSTRUCTION_SITES);
  for (var constructionSites_i in constructionSites) {
    constructionSites[constructionSites_i].remove();
  }
  var creeps = this.find(FIND_MY_CREEPS);
  for (var creeps_i in creeps) {
    creeps[creeps_i].suicide();
  }
};
