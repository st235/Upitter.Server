'use strict';

const _ = require('underscore');

const AppUnit = require('../app/unit');

class CompaniesManager extends AppUnit {
	constructor(companyModel, postModel) {
		super({
			companyModel,
			postModel
		});
	}

	_onBind() {
		this.findByAlias = this.findByAlias.bind(this);
		this.create = this.create.bind(this);
		this.checkIfExists = this.checkIfExists.bind(this);
		this.edit = this.edit.bind(this);
		this.findById = this.findById.bind(this);
		this.getObjectId = this.getObjectId.bind(this);
		this.toggleUserSubscription = this.toggleUserSubscription.bind(this);
		this.getSubscribers = this.getSubscribers.bind(this);
		this.getSebscrubersIds = this.getSebscrubersIds.bind(this);
		this.favorite = this.favorite.bind(this);
		this.getFavorites = this.getFavorites.bind(this);
	}

	findByAlias(alias) {
		return this
			.companyModel
			.findByAlias(alias)
			.then(company => {
				if (!company) throw 'INTERNAL_SERVER_ERROR';
				return company;
			});
	}

	//  TODO: переделать
	create(data) {
		const businessUser = new this.companyModel(data);
		return businessUser
			.save()
			.then(company => {
				company.alias = `id${ Math.abs(company.customId) }`;
				return company.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	checkIfExists(phone) {
		return this
			.companyModel
			.findOne({ 'phone.fullNumber': phone })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	edit(customId, companyInfo, coordinates) {
		const data = _.omit(companyInfo, field => _.isUndefined(field));
		if (coordinates) this.updatePostCoords(customId, coordinates);

		//TODO: Добавить проверку по соц сетям
		return this
			.companyModel
			.findOne({ customId })
			.exec()
			.then(company => {
				company = _.extend(company, data);
				company.coordinates = coordinates;
				console.log('MANAGER: AFTER UPDATE');
				console.log(company);
				return company.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	updatePostCoords(companyId, coordinates) {
		let oldCoordinates;
		return this
			.companyModel
			.findById(companyId)
			.then(company => {
				oldCoordinates = company.coordinates;
				return _.each(company.coordinates, (coord, i) => {
					_.each(coordinates, newCoord => {
						if (parseFloat(coord.longitude) === parseFloat(newCoord.longitude) && parseFloat(coord.latitude) === parseFloat(newCoord.latitude)) delete oldCoordinates[i];
					});
				});
			})
			.then(promises => Promise.all(promises))
			.then(() => {
				return _.each(_.compact(oldCoordinates), coord => {
					this
						.postModel
						.find({ location: [coord.latitude, coord.longitude] })
						.exec()
						.then(posts => {
							return _.each(posts, post => {
								post.location = null;
								post.save();
							});
						});
				});
			});
	}

	findById(companyId) {
		return this
			.companyModel
			.findOne({ customId: companyId })
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getObjectId(companyId) {
		return this
			.companyModel
			.findOne({ customId: companyId })
			.exec()
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			})
			.then(company => company._id);
	}

	toggleUserSubscription(userId, customId) {
		return this
			.companyModel
			.findOne({ customId })
			.exec()
			.then(company => {
				if (!company) throw 'INTERNAL SERVER ERROR';

				const userIdString = userId.toString();
				if (_.indexOf(company.subscribers, userIdString) !== -1) {
					company.subscribers = _.without(company.subscribers, userIdString);
				} else {
					company.subscribers.push(userIdString);
				}
				return company.save();
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getSubscribers(alias, limit, subId) {
		let subscribers;
		let index = 0;
		let amount;

		return this
			.companyModel
			.findOne({ alias })
			.populate('subscribers')
			.exec()
			.then(currentCompany => {
				subscribers = currentCompany.subscribers;
				amount = subscribers.length;
				return subId ? _.each(subscribers, (user, i) => (user.customId === parseInt(subId, 10)) ? index = i + 1 : index) : subscribers;
			})
			.then(promises => Promise.all(promises))
			.then(() => {
				subscribers = subscribers.splice(index, limit);
				return { subscribers, amount };
			})
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	getSebscrubersIds(companyId)
	{
		return this
			.companyModel
			.findOne({ customId: companyId })
			.populate('subscribers')
			.exec()
			.then(company => _.map(company.subscribers, subscriber => subscriber.customId))
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}

	favorite(customId, postId) {
		return this
			.companyModel
			.findOne({ customId })
			.exec()
			.then(company => {
				const postIdString = postId.toString();
				const findQuery = _.find(company.favorites, favorite => favorite === postIdString);
				if (findQuery) company.favorites = _.without(company.favorites, postIdString);
				else company.favorites.push(postIdString);
				return company.save();
			});
	}

	getFavorites(customId) {
		return this
			.companyModel
			.findOne({ customId })
			.populate('favorites')
			.exec()
			.then(company => company.favorites)
			.catch(() => {
				throw 'INTERNAL_SERVER_ERROR';
			});
	}
}

module.exports = CompaniesManager;
