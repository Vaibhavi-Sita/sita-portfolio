package com.sita.portfolio.service;

import com.sita.portfolio.exception.BadRequestException;
import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.SkillCategoryResponse;
import com.sita.portfolio.model.entity.SkillCategory;
import com.sita.portfolio.model.entity.SkillItem;
import com.sita.portfolio.repository.SkillCategoryRepository;
import com.sita.portfolio.repository.SkillItemRepository;
import com.sita.portfolio.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service for skill management (admin operations).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SkillService {

    private final SkillCategoryRepository categoryRepository;
    private final SkillItemRepository itemRepository;
    private final EntityMapper mapper;

    /**
     * Gets all skill categories (admin view - includes unpublished).
     */
    @Transactional(readOnly = true)
    public List<SkillCategoryResponse> getAllCategories() {
        return mapper.toSkillCategoryResponseList(
                categoryRepository.findAllByOrderBySortOrderAsc()
        );
    }

    /**
     * Gets a skill category by ID.
     */
    @Transactional(readOnly = true)
    public SkillCategoryResponse getCategory(UUID id) {
        return categoryRepository.findById(id)
                .map(mapper::toSkillCategoryResponse)
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", id));
    }

    /**
     * Creates a new skill category.
     */
    @Transactional
    public SkillCategoryResponse createCategory(CreateSkillCategoryRequest request) {
        int maxSortOrder = categoryRepository.findMaxSortOrder();

        SkillCategory category = SkillCategory.builder()
                .name(request.getName())
                .icon(request.getIcon())
                .published(request.isPublished())
                .sortOrder(maxSortOrder + 1)
                .build();

        SkillCategory saved = categoryRepository.save(category);
        log.info("Created skill category: {}", saved.getName());

        return mapper.toSkillCategoryResponse(saved);
    }

    /**
     * Updates an existing skill category.
     */
    @Transactional
    public SkillCategoryResponse updateCategory(UUID id, UpdateSkillCategoryRequest request) {
        SkillCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", id));

        if (request.getName() != null) category.setName(request.getName());
        if (request.getIcon() != null) category.setIcon(request.getIcon());
        if (request.getPublished() != null) category.setPublished(request.getPublished());
        if (request.getSortOrder() != null) category.setSortOrder(request.getSortOrder());

        SkillCategory saved = categoryRepository.save(category);
        log.info("Updated skill category: {}", id);

        return mapper.toSkillCategoryResponse(saved);
    }

    /**
     * Deletes a skill category.
     */
    @Transactional
    public void deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("SkillCategory", "id", id);
        }
        categoryRepository.deleteById(id);
        log.info("Deleted skill category: {}", id);
    }

    /**
     * Toggles the publish status of a skill category.
     */
    @Transactional
    public SkillCategoryResponse setCategoryPublished(UUID id, boolean published) {
        SkillCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", id));

        category.setPublished(published);
        SkillCategory saved = categoryRepository.save(category);

        log.info("Set skill category {} published={}", id, published);
        return mapper.toSkillCategoryResponse(saved);
    }

    /**
     * Reorders skill categories.
     * Validates all IDs exist before updating.
     */
    @Transactional
    public List<SkillCategoryResponse> reorderCategories(ReorderRequest request) {
        List<UUID> orderedIds = request.getOrderedIds();
        
        // Validate all IDs exist
        List<SkillCategory> categories = categoryRepository.findAllById(orderedIds);
        if (categories.size() != orderedIds.size()) {
            List<UUID> foundIds = categories.stream().map(SkillCategory::getId).toList();
            List<UUID> missingIds = orderedIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new BadRequestException(
                    "Invalid skill category IDs: " + missingIds,
                    "orderedIds"
            );
        }
        
        // Update sort orders in a single transaction
        for (int i = 0; i < orderedIds.size(); i++) {
            UUID targetId = orderedIds.get(i);
            int newSortOrder = i;
            categories.stream()
                    .filter(cat -> cat.getId().equals(targetId))
                    .findFirst()
                    .ifPresent(cat -> cat.setSortOrder(newSortOrder));
        }
        categoryRepository.saveAll(categories);
        
        log.info("Reordered {} skill categories", orderedIds.size());
        return getAllCategories();
    }

    /**
     * Reorders skill items within a category.
     * Validates category and all item IDs exist before updating.
     */
    @Transactional
    public SkillCategoryResponse reorderSkillItems(ReorderSkillItemsRequest request) {
        // Validate category exists
        SkillCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", request.getCategoryId()));

        // Extract ordered IDs and validate all exist
        List<UUID> orderedIds = request.getOrderedIds();

        List<SkillItem> items = itemRepository.findAllById(orderedIds);
        if (items.size() != orderedIds.size()) {
            List<UUID> foundIds = items.stream().map(SkillItem::getId).toList();
            List<UUID> missingIds = orderedIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new BadRequestException(
                    "Invalid skill item IDs: " + missingIds,
                    "orderedIds"
            );
        }

        Map<UUID, SkillItem> itemsById = items.stream()
                .collect(Collectors.toMap(SkillItem::getId, item -> item));

        // Validate all items belong to the specified category
        for (UUID itemId : orderedIds) {
            SkillItem item = itemsById.get(itemId);
            if (!item.getCategory().getId().equals(request.getCategoryId())) {
                throw new BadRequestException(
                        "Skill item " + item.getId() + " does not belong to category " + request.getCategoryId(),
                        "orderedIds"
                );
            }
        }

        // Update sort orders based on provided order
        for (int i = 0; i < orderedIds.size(); i++) {
            UUID itemId = orderedIds.get(i);
            SkillItem item = itemsById.get(itemId);
            item.setSortOrder(i);
        }
        itemRepository.saveAll(items);
        
        log.info("Reordered {} skill items in category {}", items.size(), request.getCategoryId());
        
        // Refresh and return the category
        return mapper.toSkillCategoryResponse(categoryRepository.findById(request.getCategoryId()).orElse(category));
    }

    /**
     * Adds a skill item to a category.
     */
    @Transactional
    public SkillCategoryResponse addSkillItem(CreateSkillItemRequest request) {
        SkillCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("SkillCategory", "id", request.getCategoryId()));

        int maxSortOrder = itemRepository.findMaxSortOrderByCategoryId(request.getCategoryId());

        SkillItem item = SkillItem.builder()
                .name(request.getName())
                .iconUrl(request.getIconUrl())
                .proficiency(request.getProficiency())
                .sortOrder(maxSortOrder + 1)
                .build();

        category.addSkill(item);
        SkillCategory saved = categoryRepository.save(category);

        log.info("Added skill item {} to category {}", request.getName(), request.getCategoryId());
        return mapper.toSkillCategoryResponse(saved);
    }

    /**
     * Updates a skill item.
     */
    @Transactional
    public SkillCategoryResponse updateSkillItem(UUID itemId, UpdateSkillItemRequest request) {
        SkillItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillItem", "id", itemId));

        if (request.getName() != null) item.setName(request.getName());
        if (request.getIconUrl() != null) item.setIconUrl(request.getIconUrl());
        if (request.getProficiency() != null) item.setProficiency(request.getProficiency());
        if (request.getSortOrder() != null) item.setSortOrder(request.getSortOrder());

        itemRepository.save(item);
        log.info("Updated skill item: {}", itemId);

        return mapper.toSkillCategoryResponse(item.getCategory());
    }

    /**
     * Deletes a skill item.
     */
    @Transactional
    public void deleteSkillItem(UUID itemId) {
        SkillItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillItem", "id", itemId));

        SkillCategory category = item.getCategory();
        category.removeSkill(item);
        categoryRepository.save(category);

        log.info("Deleted skill item: {}", itemId);
    }

}
