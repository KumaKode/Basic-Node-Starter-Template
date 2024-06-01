class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }

  async delete(id) {
    const response = await this.model.findByIdAndDelete(id);
    return response;
  }

  async find(data) {
    const response = await this.model.findOne(data).exec();
    return response;
  }

  async findAll(data) {
    const response = await this.model.find(data);
    return response;
  }

  async update(id, data) {
    const response = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });

    return response;
  }
}

module.exports = CrudRepository;
