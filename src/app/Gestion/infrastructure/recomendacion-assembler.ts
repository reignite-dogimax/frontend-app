import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Recommendation } from '../domain/model/recommendation.entity';
import { RecommendationResource, RecommendationsResponse, RecomendacionesResponse } from './gestion-response';

/**
 * Assembler for converting between Recommendation entity and resources.
 */
export class RecomendacionAssembler implements BaseAssembler<Recommendation, RecommendationResource, RecommendationsResponse> {
  
  /**
   * Converts a Recommendation entity to a resource.
   * @param entity - The Recommendation entity to convert.
   * @returns A resource representation of the Recommendation.
   */
  toResourceFromEntity(entity: Recommendation): RecommendationResource {
    return {
      id: entity.id,
      petId: entity.petId,
      type: entity.type,
      title: entity.title,
      description: entity.description,
      priority: entity.priority,
      generationDate: entity.generationDate.toISOString(),
      expirationDate: entity.expirationDate?.toISOString(),
      isCompleted: entity.isCompleted,
      completionDate: entity.completionDate?.toISOString(),
      aiSource: entity.aiSource,
      confidence: entity.confidence,
      parameters: entity.parameters
    };
  }

  /**
   * Converts a resource to a Recommendation entity.
   * @param resource - The resource to convert.
   * @returns a Recommendation entity.
   */
  toEntityFromResource(resource: RecommendationResource): Recommendation {
    return new Recommendation({
      id: resource.id,
      petId: resource.petId,
      type: resource.type as any,
      title: resource.title,
      description: resource.description,
      priority: resource.priority as any,
      generationDate: new Date(resource.generationDate),
      expirationDate: resource.expirationDate ? new Date(resource.expirationDate) : undefined,
      isCompleted: resource.isCompleted,
      completionDate: resource.completionDate ? new Date(resource.completionDate) : undefined,
      aiSource: resource.aiSource || '',
      confidence: resource.confidence || 0,
      parameters: resource.parameters
    });
  }

  /**
   * Converts a response to an array of Recommendation entities.
   * @param response - The response containing recommendations.
   * @returns Array of Recommendation entities.
   */
  toEntitiesFromResponse(response: RecommendationsResponse | RecomendacionesResponse): Recommendation[] {
    const recommendations = 'recommendations' in response ? response.recommendations : response.recomendaciones;
    if (!recommendations) {
      return [];
    }
    return recommendations.map((resource: RecommendationResource) => this.toEntityFromResource(resource));
  }
}