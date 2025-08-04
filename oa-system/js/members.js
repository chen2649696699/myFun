// 成员管理模块
class MembersManager {
    constructor() {
        this.members = [];
        this.departments = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMembersData();
    }

    bindEvents() {
        // 添加成员按钮
        const addMemberBtn = document.getElementById('add-member');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', () => {
                this.showAddMemberModal();
            });
        }
    }

    async loadMembersData() {
        try {
            // 模拟API调用
            const [membersResponse, departmentsResponse] = await Promise.all([
                this.apiCall('/api/members'),
                this.apiCall('/api/departments')
            ]);

            this.members = membersResponse.data;
            this.departments = departmentsResponse.data;

            this.renderMembersGrid();
        } catch (error) {
            console.error('加载成员数据失败:', error);
            window.oaSystem.showToast('加载成员数据失败', 'error');
        }
    }

    renderMembersGrid() {
        const gridContainer = document.getElementById('members-grid');
        if (!gridContainer) return;

        const membersHTML = this.members.map(member => this.generateMemberCard(member)).join('');
        gridContainer.innerHTML = membersHTML;

        // 绑定成员卡片事件
        this.bindMemberEvents();
    }

    generateMemberCard(member) {
        const department = this.departments.find(dept => dept.name === member.department);
        
        return `
            <div class="member-card" data-member-id="${member.id}">
                <div class="member-header">
                    <img src="https://via.placeholder.com/50x50" alt="${member.name}" class="member-avatar">
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p>${member.position}</p>
                    </div>
                    <div class="member-status">
                        <span class="status-badge status-${member.status}">
                            ${member.status === 'active' ? '在职' : '离职'}
                        </span>
                    </div>
                </div>
                
                <div class="member-details">
                    <div class="member-detail">
                        <span>部门:</span>
                        <span>${member.department}</span>
                    </div>
                    <div class="member-detail">
                        <span>邮箱:</span>
                        <span>${member.email}</span>
                    </div>
                    <div class="member-detail">
                        <span>电话:</span>
                        <span>${member.phone}</span>
                    </div>
                    <div class="member-detail">
                        <span>入职时间:</span>
                        <span>${this.formatDate(new Date())}</span>
                    </div>
                </div>
                
                <div class="member-actions">
                    <button class="btn btn-secondary btn-small" onclick="membersManager.editMember(${member.id})">
                        <i class="fas fa-edit"></i> 编辑
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="membersManager.viewMemberDetails(${member.id})">
                        <i class="fas fa-eye"></i> 详情
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="membersManager.toggleMemberStatus(${member.id})">
                        <i class="fas fa-${member.status === 'active' ? 'user-slash' : 'user-check'}"></i>
                        ${member.status === 'active' ? '停用' : '启用'}
                    </button>
                </div>
            </div>
        `;
    }

    bindMemberEvents() {
        // 成员卡片点击事件
        document.querySelectorAll('.member-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.member-actions')) {
                    const memberId = card.dataset.memberId;
                    this.viewMemberDetails(memberId);
                }
            });
        });
    }

    showAddMemberModal() {
        const modalContent = `
            <form id="add-member-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="member-name">姓名</label>
                        <input type="text" id="member-name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="member-position">职位</label>
                        <input type="text" id="member-position" class="form-control" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="member-department">部门</label>
                        <select id="member-department" class="form-control" required>
                            <option value="">请选择部门</option>
                            ${this.departments.map(dept => `
                                <option value="${dept.name}">${dept.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="member-status">状态</label>
                        <select id="member-status" class="form-control" required>
                            <option value="active">在职</option>
                            <option value="inactive">离职</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="member-email">邮箱</label>
                        <input type="email" id="member-email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="member-phone">电话</label>
                        <input type="tel" id="member-phone" class="form-control" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="member-avatar">头像</label>
                    <input type="file" id="member-avatar" class="form-control" accept="image/*">
                </div>
                
                <div class="form-group">
                    <label for="member-bio">个人简介</label>
                    <textarea id="member-bio" class="form-control" rows="3" placeholder="请输入个人简介"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.oaSystem.closeModal()">取消</button>
                    <button type="submit" class="btn btn-primary">添加成员</button>
                </div>
            </form>
        `;

        window.oaSystem.showModal('添加成员', modalContent);

        // 绑定表单提交事件
        document.getElementById('add-member-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddMember();
        });
    }

    async handleAddMember() {
        const formData = {
            name: document.getElementById('member-name').value,
            position: document.getElementById('member-position').value,
            department: document.getElementById('member-department').value,
            status: document.getElementById('member-status').value,
            email: document.getElementById('member-email').value,
            phone: document.getElementById('member-phone').value,
            bio: document.getElementById('member-bio').value
        };

        // 验证表单
        const errors = window.oaSystem.validateForm(formData);
        if (errors.length > 0) {
            window.oaSystem.showToast(errors.join(', '), 'error');
            return;
        }

        try {
            // 模拟API调用
            const response = await this.apiCall('/api/members', 'POST', formData);
            
            if (response.success) {
                window.oaSystem.showToast('成员添加成功', 'success');
                window.oaSystem.closeModal();
                this.loadMembersData(); // 重新加载数据
            } else {
                window.oaSystem.showToast(response.message || '添加失败', 'error');
            }
        } catch (error) {
            console.error('添加成员失败:', error);
            window.oaSystem.showToast('添加成员失败', 'error');
        }
    }

    editMember(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const modalContent = `
            <form id="edit-member-form">
                <input type="hidden" id="member-id" value="${member.id}">
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="member-name">姓名</label>
                        <input type="text" id="member-name" class="form-control" value="${member.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="member-position">职位</label>
                        <input type="text" id="member-position" class="form-control" value="${member.position}" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="member-department">部门</label>
                        <select id="member-department" class="form-control" required>
                            <option value="">请选择部门</option>
                            ${this.departments.map(dept => `
                                <option value="${dept.name}" ${dept.name === member.department ? 'selected' : ''}>
                                    ${dept.name}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="member-status">状态</label>
                        <select id="member-status" class="form-control" required>
                            <option value="active" ${member.status === 'active' ? 'selected' : ''}>在职</option>
                            <option value="inactive" ${member.status === 'inactive' ? 'selected' : ''}>离职</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="member-email">邮箱</label>
                        <input type="email" id="member-email" class="form-control" value="${member.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="member-phone">电话</label>
                        <input type="tel" id="member-phone" class="form-control" value="${member.phone}" required>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.oaSystem.closeModal()">取消</button>
                    <button type="submit" class="btn btn-primary">保存修改</button>
                </div>
            </form>
        `;

        window.oaSystem.showModal('编辑成员', modalContent);

        // 绑定表单提交事件
        document.getElementById('edit-member-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditMember();
        });
    }

    async handleEditMember() {
        const formData = {
            id: document.getElementById('member-id').value,
            name: document.getElementById('member-name').value,
            position: document.getElementById('member-position').value,
            department: document.getElementById('member-department').value,
            status: document.getElementById('member-status').value,
            email: document.getElementById('member-email').value,
            phone: document.getElementById('member-phone').value
        };

        try {
            const response = await this.apiCall(`/api/members/${formData.id}`, 'PUT', formData);
            
            if (response.success) {
                window.oaSystem.showToast('成员信息更新成功', 'success');
                window.oaSystem.closeModal();
                this.loadMembersData();
            } else {
                window.oaSystem.showToast(response.message || '更新失败', 'error');
            }
        } catch (error) {
            console.error('更新成员失败:', error);
            window.oaSystem.showToast('更新成员失败', 'error');
        }
    }

    viewMemberDetails(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const department = this.departments.find(dept => dept.name === member.department);

        const modalContent = `
            <div class="member-details-modal">
                <div class="member-profile">
                    <div class="profile-header">
                        <img src="https://via.placeholder.com/80x80" alt="${member.name}" class="profile-avatar">
                        <div class="profile-info">
                            <h2>${member.name}</h2>
                            <p class="profile-position">${member.position}</p>
                            <span class="status-badge status-${member.status}">
                                ${member.status === 'active' ? '在职' : '离职'}
                            </span>
                        </div>
                    </div>
                    
                    <div class="profile-details">
                        <div class="detail-section">
                            <h3>基本信息</h3>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <span class="detail-label">部门:</span>
                                    <span class="detail-value">${member.department}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">邮箱:</span>
                                    <span class="detail-value">${member.email}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">电话:</span>
                                    <span class="detail-value">${member.phone}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">入职时间:</span>
                                    <span class="detail-value">${this.formatDate(new Date())}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>工作统计</h3>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-number">156</div>
                                    <div class="stat-label">完成任务</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">23</div>
                                    <div class="stat-label">进行中任务</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">95%</div>
                                    <div class="stat-label">工作效率</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">12</div>
                                    <div class="stat-label">参与项目</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h3>最近活动</h3>
                            <div class="activity-list">
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-tasks"></i>
                                    </div>
                                    <div class="activity-content">
                                        <p>完成了任务"用户界面优化"</p>
                                        <span class="time">2小时前</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-comment"></i>
                                    </div>
                                    <div class="activity-content">
                                        <p>在项目讨论中发表了新观点</p>
                                        <span class="time">1天前</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-file-alt"></i>
                                    </div>
                                    <div class="activity-content">
                                        <p>提交了代码审查请求</p>
                                        <span class="time">2天前</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        window.oaSystem.showModal(`成员详情 - ${member.name}`, modalContent);
    }

    async toggleMemberStatus(memberId) {
        const member = this.members.find(m => m.id === memberId);
        if (!member) return;

        const newStatus = member.status === 'active' ? 'inactive' : 'active';
        const actionText = newStatus === 'active' ? '启用' : '停用';

        const confirmContent = `
            <div class="confirm-action">
                <div class="confirm-icon">
                    <i class="fas fa-${newStatus === 'active' ? 'user-check' : 'user-slash'}"></i>
                </div>
                <h3>确认${actionText}成员</h3>
                <p>您确定要${actionText}成员 <strong>"${member.name}"</strong> 吗？</p>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.oaSystem.closeModal()">取消</button>
                    <button type="button" class="btn btn-primary" onclick="membersManager.confirmToggleStatus(${memberId}, '${newStatus}')">
                        确认${actionText}
                    </button>
                </div>
            </div>
        `;

        window.oaSystem.showModal(`${actionText}成员`, confirmContent);
    }

    async confirmToggleStatus(memberId, newStatus) {
        try {
            const response = await this.apiCall(`/api/members/${memberId}/status`, 'PUT', { status: newStatus });
            
            if (response.success) {
                const actionText = newStatus === 'active' ? '启用' : '停用';
                window.oaSystem.showToast(`成员${actionText}成功`, 'success');
                window.oaSystem.closeModal();
                this.loadMembersData();
            } else {
                window.oaSystem.showToast(response.message || '操作失败', 'error');
            }
        } catch (error) {
            console.error('更新成员状态失败:', error);
            window.oaSystem.showToast('更新成员状态失败', 'error');
        }
    }

    // 工具函数
    formatDate(date) {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // API调用模拟
    async apiCall(endpoint, method = 'GET', data = null) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            success: true,
            data: this.getMockData(endpoint),
            message: '操作成功'
        };
    }

    getMockData(endpoint) {
        const mockData = {
            '/api/members': this.members,
            '/api/departments': this.departments
        };
        
        return mockData[endpoint] || [];
    }
}

// 初始化成员管理器
let membersManager;
document.addEventListener('DOMContentLoaded', () => {
    membersManager = new MembersManager();
});

// 添加成员管理相关样式
const memberStyles = `
<style>
.member-details-modal {
    max-height: 70vh;
    overflow-y: auto;
}

.member-profile {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
}

.profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
}

.profile-info h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 5px;
}

.profile-position {
    font-size: 16px;
    color: #666;
    margin-bottom: 10px;
}

.profile-details {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.detail-section h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.detail-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

.detail-value {
    font-size: 14px;
    color: #333;
    font-weight: 600;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
}

.stats-grid .stat-item {
    background: #f8f9ff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

.stats-grid .stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 5px;
}

.stats-grid .stat-label {
    font-size: 12px;
    color: #666;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.activity-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
    border-radius: 8px;
    background: #f8f9ff;
    transition: background-color 0.3s ease;
}

.activity-item:hover {
    background: #f0f0f0;
}

.activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
}

.activity-content p {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
}

.activity-content .time {
    font-size: 12px;
    color: #999;
}

.confirm-action {
    text-align: center;
    padding: 20px;
}

.confirm-action .confirm-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #f8f9ff;
    color: #667eea;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 20px;
}

.confirm-action h3 {
    margin-bottom: 10px;
    color: #333;
}

.confirm-action p {
    color: #666;
    margin-bottom: 20px;
}

@media (max-width: 768px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .profile-header {
        flex-direction: column;
        text-align: center;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', memberStyles);