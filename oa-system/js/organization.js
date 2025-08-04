// 组织架构管理模块
class OrganizationManager {
    constructor() {
        this.departments = [];
        this.members = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadOrganizationData();
    }

    bindEvents() {
        // 添加部门按钮
        const addDepartmentBtn = document.getElementById('add-department');
        if (addDepartmentBtn) {
            addDepartmentBtn.addEventListener('click', () => {
                this.showAddDepartmentModal();
            });
        }
    }

    async loadOrganizationData() {
        try {
            // 模拟API调用
            const [departmentsResponse, membersResponse] = await Promise.all([
                this.apiCall('/api/departments'),
                this.apiCall('/api/members')
            ]);

            this.departments = departmentsResponse.data;
            this.members = membersResponse.data;

            this.renderOrganizationChart();
        } catch (error) {
            console.error('加载组织架构数据失败:', error);
            window.oaSystem.showToast('加载组织架构数据失败', 'error');
        }
    }

    renderOrganizationChart() {
        const chartContainer = document.getElementById('org-chart');
        if (!chartContainer) return;

        // 创建组织架构图
        const chartHTML = this.generateOrgChartHTML();
        chartContainer.innerHTML = chartHTML;

        // 绑定部门卡片事件
        this.bindDepartmentEvents();
    }

    generateOrgChartHTML() {
        // 按层级组织部门数据
        const departmentTree = this.buildDepartmentTree();
        
        return `
            <div class="org-chart-tree">
                ${this.renderDepartmentNode(departmentTree)}
            </div>
        `;
    }

    buildDepartmentTree() {
        // 构建部门树形结构
        const departmentMap = new Map();
        const rootDepartments = [];

        // 创建部门映射
        this.departments.forEach(dept => {
            departmentMap.set(dept.id, {
                ...dept,
                children: [],
                members: this.members.filter(member => member.department === dept.name)
            });
        });

        // 构建树形结构（这里简化处理，假设所有部门都是顶级部门）
        this.departments.forEach(dept => {
            rootDepartments.push(departmentMap.get(dept.id));
        });

        return rootDepartments;
    }

    renderDepartmentNode(departments, level = 0) {
        if (!departments || departments.length === 0) return '';

        return `
            <div class="org-level org-level-${level}">
                ${departments.map(dept => `
                    <div class="department-card" data-department-id="${dept.id}">
                        <div class="department-header">
                            <div class="department-icon">
                                <i class="fas fa-building"></i>
                            </div>
                            <div class="department-info">
                                <h3>${dept.name}</h3>
                                <p>${dept.description}</p>
                            </div>
                            <div class="department-actions">
                                <button class="btn-icon" onclick="orgManager.editDepartment(${dept.id})" title="编辑部门">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon" onclick="orgManager.deleteDepartment(${dept.id})" title="删除部门">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="department-stats">
                            <div class="stat-item">
                                <span class="stat-label">负责人:</span>
                                <span class="stat-value">${dept.manager}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">成员数:</span>
                                <span class="stat-value">${dept.memberCount}</span>
                            </div>
                        </div>
                        <div class="department-members">
                            <h4>部门成员</h4>
                            <div class="members-list">
                                ${this.renderDepartmentMembers(dept.members)}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderDepartmentMembers(members) {
        if (!members || members.length === 0) {
            return '<p class="no-members">暂无成员</p>';
        }

        return members.slice(0, 5).map(member => `
            <div class="member-item">
                <img src="https://via.placeholder.com/32x32" alt="${member.name}" class="member-avatar">
                <div class="member-info">
                    <span class="member-name">${member.name}</span>
                    <span class="member-position">${member.position}</span>
                </div>
                <span class="status-badge status-${member.status}">
                    ${member.status === 'active' ? '在职' : '离职'}
                </span>
            </div>
        `).join('') + (members.length > 5 ? `<div class="more-members">+${members.length - 5} 更多</div>` : '');
    }

    bindDepartmentEvents() {
        // 部门卡片点击事件
        document.querySelectorAll('.department-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.department-actions')) {
                    const deptId = card.dataset.departmentId;
                    this.showDepartmentDetails(deptId);
                }
            });
        });
    }

    showAddDepartmentModal() {
        const modalContent = `
            <form id="add-department-form">
                <div class="form-group">
                    <label for="dept-name">部门名称</label>
                    <input type="text" id="dept-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="dept-manager">部门负责人</label>
                    <select id="dept-manager" class="form-control" required>
                        <option value="">请选择负责人</option>
                        ${this.members.map(member => `
                            <option value="${member.name}">${member.name} - ${member.position}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="dept-description">部门描述</label>
                    <textarea id="dept-description" class="form-control" rows="3" placeholder="请输入部门职责描述"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.oaSystem.closeModal()">取消</button>
                    <button type="submit" class="btn btn-primary">创建部门</button>
                </div>
            </form>
        `;

        window.oaSystem.showModal('添加部门', modalContent);

        // 绑定表单提交事件
        document.getElementById('add-department-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddDepartment();
        });
    }

    async handleAddDepartment() {
        const formData = {
            name: document.getElementById('dept-name').value,
            manager: document.getElementById('dept-manager').value,
            description: document.getElementById('dept-description').value
        };

        // 验证表单
        const errors = window.oaSystem.validateForm(formData);
        if (errors.length > 0) {
            window.oaSystem.showToast(errors.join(', '), 'error');
            return;
        }

        try {
            // 模拟API调用
            const response = await this.apiCall('/api/departments', 'POST', formData);
            
            if (response.success) {
                window.oaSystem.showToast('部门创建成功', 'success');
                window.oaSystem.closeModal();
                this.loadOrganizationData(); // 重新加载数据
            } else {
                window.oaSystem.showToast(response.message || '创建失败', 'error');
            }
        } catch (error) {
            console.error('创建部门失败:', error);
            window.oaSystem.showToast('创建部门失败', 'error');
        }
    }

    editDepartment(deptId) {
        const department = this.departments.find(dept => dept.id === deptId);
        if (!department) return;

        const modalContent = `
            <form id="edit-department-form">
                <input type="hidden" id="dept-id" value="${department.id}">
                <div class="form-group">
                    <label for="dept-name">部门名称</label>
                    <input type="text" id="dept-name" class="form-control" value="${department.name}" required>
                </div>
                <div class="form-group">
                    <label for="dept-manager">部门负责人</label>
                    <select id="dept-manager" class="form-control" required>
                        <option value="">请选择负责人</option>
                        ${this.members.map(member => `
                            <option value="${member.name}" ${member.name === department.manager ? 'selected' : ''}>
                                ${member.name} - ${member.position}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="dept-description">部门描述</label>
                    <textarea id="dept-description" class="form-control" rows="3">${department.description}</textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.oaSystem.closeModal()">取消</button>
                    <button type="submit" class="btn btn-primary">保存修改</button>
                </div>
            </form>
        `;

        window.oaSystem.showModal('编辑部门', modalContent);

        // 绑定表单提交事件
        document.getElementById('edit-department-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditDepartment();
        });
    }

    async handleEditDepartment() {
        const formData = {
            id: document.getElementById('dept-id').value,
            name: document.getElementById('dept-name').value,
            manager: document.getElementById('dept-manager').value,
            description: document.getElementById('dept-description').value
        };

        try {
            const response = await this.apiCall(`/api/departments/${formData.id}`, 'PUT', formData);
            
            if (response.success) {
                window.oaSystem.showToast('部门信息更新成功', 'success');
                window.oaSystem.closeModal();
                this.loadOrganizationData();
            } else {
                window.oaSystem.showToast(response.message || '更新失败', 'error');
            }
        } catch (error) {
            console.error('更新部门失败:', error);
            window.oaSystem.showToast('更新部门失败', 'error');
        }
    }

    async deleteDepartment(deptId) {
        const department = this.departments.find(dept => dept.id === deptId);
        if (!department) return;

        const confirmContent = `
            <div class="confirm-delete">
                <div class="confirm-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>确认删除部门</h3>
                <p>您确定要删除部门 <strong>"${department.name}"</strong> 吗？</p>
                <p class="warning-text">此操作不可撤销，部门下的所有成员将需要重新分配。</p>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="window.oaSystem.closeModal()">取消</button>
                    <button type="button" class="btn btn-danger" onclick="orgManager.confirmDeleteDepartment(${deptId})">确认删除</button>
                </div>
            </div>
        `;

        window.oaSystem.showModal('删除部门', confirmContent);
    }

    async confirmDeleteDepartment(deptId) {
        try {
            const response = await this.apiCall(`/api/departments/${deptId}`, 'DELETE');
            
            if (response.success) {
                window.oaSystem.showToast('部门删除成功', 'success');
                window.oaSystem.closeModal();
                this.loadOrganizationData();
            } else {
                window.oaSystem.showToast(response.message || '删除失败', 'error');
            }
        } catch (error) {
            console.error('删除部门失败:', error);
            window.oaSystem.showToast('删除部门失败', 'error');
        }
    }

    showDepartmentDetails(deptId) {
        const department = this.departments.find(dept => dept.id === deptId);
        const members = this.members.filter(member => member.department === department.name);

        const modalContent = `
            <div class="department-details">
                <div class="dept-header">
                    <div class="dept-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="dept-info">
                        <h2>${department.name}</h2>
                        <p>${department.description}</p>
                    </div>
                </div>
                
                <div class="dept-stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${department.memberCount}</div>
                        <div class="stat-label">总成员数</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${members.filter(m => m.status === 'active').length}</div>
                        <div class="stat-label">在职成员</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${department.manager}</div>
                        <div class="stat-label">部门负责人</div>
                    </div>
                </div>

                <div class="dept-members-section">
                    <div class="section-header">
                        <h3>部门成员 (${members.length})</h3>
                        <button class="btn btn-primary btn-small" onclick="orgManager.addMemberToDepartment(${deptId})">
                            <i class="fas fa-plus"></i> 添加成员
                        </button>
                    </div>
                    <div class="members-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>姓名</th>
                                    <th>职位</th>
                                    <th>邮箱</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${members.map(member => `
                                    <tr>
                                        <td>
                                            <div class="member-cell">
                                                <img src="https://via.placeholder.com/32x32" alt="${member.name}" class="member-avatar">
                                                <span>${member.name}</span>
                                            </div>
                                        </td>
                                        <td>${member.position}</td>
                                        <td>${member.email}</td>
                                        <td>
                                            <span class="status-badge status-${member.status}">
                                                ${member.status === 'active' ? '在职' : '离职'}
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn-icon" onclick="orgManager.editMember(${member.id})" title="编辑">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-icon" onclick="orgManager.removeMemberFromDepartment(${member.id}, ${deptId})" title="移除">
                                                <i class="fas fa-user-minus"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        window.oaSystem.showModal(`部门详情 - ${department.name}`, modalContent);
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
            '/api/departments': this.departments,
            '/api/members': this.members
        };
        
        return mockData[endpoint] || [];
    }
}

// 初始化组织架构管理器
let orgManager;
document.addEventListener('DOMContentLoaded', () => {
    orgManager = new OrganizationManager();
});

// 添加组织架构相关样式
const orgStyles = `
<style>
.org-chart-tree {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.org-level {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
}

.department-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
}

.department-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.department-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.department-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
}

.department-info h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
}

.department-info p {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.department-actions {
    margin-left: auto;
    display: flex;
    gap: 8px;
}

.btn-icon {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: #f0f0f0;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.btn-icon:hover {
    background: #e0e0e0;
    color: #333;
}

.department-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    padding: 15px;
    background: #f8f9ff;
    border-radius: 8px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.stat-label {
    font-size: 12px;
    color: #666;
}

.stat-value {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.department-members h4 {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
}

.members-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.member-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.member-item:hover {
    background-color: #f0f0f0;
}

.member-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
}

.member-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.member-name {
    font-size: 13px;
    font-weight: 500;
    color: #333;
}

.member-position {
    font-size: 11px;
    color: #666;
}

.no-members {
    font-size: 13px;
    color: #999;
    text-align: center;
    padding: 20px;
}

.more-members {
    font-size: 12px;
    color: #667eea;
    text-align: center;
    padding: 8px;
    cursor: pointer;
}

.form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

.btn-danger {
    background: #f5576c;
    color: white;
}

.btn-danger:hover {
    background: #e74c3c;
}

.confirm-delete {
    text-align: center;
    padding: 20px;
}

.confirm-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #fff3e8;
    color: #f093fb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 20px;
}

.confirm-delete h3 {
    margin-bottom: 10px;
    color: #333;
}

.confirm-delete p {
    color: #666;
    margin-bottom: 10px;
}

.warning-text {
    color: #f093fb !important;
    font-weight: 500;
}

.department-details {
    max-height: 70vh;
    overflow-y: auto;
}

.dept-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
}

.dept-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
}

.dept-info h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 5px;
}

.dept-info p {
    color: #666;
    margin: 0;
}

.dept-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 30px;
}

.dept-stats-grid .stat-card {
    background: #f8f9ff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 12px;
    color: #666;
}

.dept-members-section {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-header h3 {
    font-size: 18px;
    color: #333;
    margin: 0;
}

.members-table {
    overflow-x: auto;
}

.members-table table {
    width: 100%;
    border-collapse: collapse;
}

.members-table th,
.members-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
}

.members-table th {
    background: #f8f9ff;
    font-weight: 600;
    color: #333;
    font-size: 14px;
}

.members-table td {
    font-size: 14px;
    color: #666;
}

.member-cell {
    display: flex;
    align-items: center;
    gap: 10px;
}

.member-cell .member-avatar {
    width: 32px;
    height: 32px;
}

@media (max-width: 768px) {
    .org-level {
        grid-template-columns: 1fr;
    }
    
    .dept-stats-grid {
        grid-template-columns: 1fr;
    }
    
    .members-table {
        font-size: 12px;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', orgStyles);